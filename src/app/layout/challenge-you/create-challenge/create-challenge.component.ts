import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SkyboardComponent } from '../../../shared/modules/skyboard/skyboard.component';

import * as paper from 'paper';
import {CommonService} from "../../../shared/services/common-service";
import {SkyboardService} from "../../../shared/modules/skyboard/skyboard.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-create-challenge',
  providers: [SkyboardService, CommonService],
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.scss'],
})

export class CreateChallengeComponent implements OnInit, AfterViewInit {
  // form
  public submitted: boolean; // keep track on whether form is submitted
  blurs: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  difficulties: string[] = ['1', '2', '3', '4', '5'];
  myForm: FormGroup;
  // html elements
  @ViewChild('importQuestionBtn') importQuestionBtnRef: ElementRef;
  @ViewChild('hideAnswerBtn') hideAnswerBtnRef: ElementRef;
  @ViewChild('makeHintBtn') makeHintBtnRef: ElementRef;
  @ViewChild('addBoxBtn') addBoxBtnRef: ElementRef;
  @ViewChild('gameOptionBtn') gameOptionBtnRef: ElementRef;
  layersBtns = [];
  gameOptionBtn: any;
  thumbnailCanvas: any;
  // Game options
  @ViewChild('gameOptions') gameOptionsRef: ElementRef;
  @ViewChild('thumbnailCanvas') thumbnailCanvasRef: ElementRef;
  // blur image
  thumbnailImg: string;
  boardImage: string;
  sourceX = -1;
  sourceY = -1;
  sourceWidth = -1;
  sourceHeight = -1;
  // skyboard
  scope: paper.PaperScope;
  @ViewChild('skyboard') private skyboard: SkyboardComponent;
  skyboardMode = 'teacher-create-challenge';
  initialActiveLayerName = 'import-question';
  initialActiveToolName = 'nothing';
  // pagination
  paginationToolNumber: number;
  paginationSize: number;
  disabledPagination: number;
  isPaginationDisabled: boolean;
  pageSize: number;
  isAddNewPageDisabled: boolean;
  isRemovePageDisabled: boolean;
  @ViewChild('addNewPageBtn') addNewPageBtnRef: ElementRef;
  addNewPageBtn: any;
  @ViewChild('removeThisPageBtn') removeThisPageBtnRef: ElementRef;
  removeThisPageBtn: any;

  // form builder simplify form initialization
  constructor(
    private translate: TranslateService,
    private router: Router,
    public cs: CommonService
  ) {
    // turn off side bar
    const dom: any = document.querySelector('body');
    dom.classList.add('push-right');
    // paper scope
    this.scope = new paper.PaperScope();
    // pagination
    this.paginationToolNumber = 1;
    this.paginationSize = 1;
    this.disabledPagination = 1;
    this.isPaginationDisabled = false;
    this.pageSize = 10;
    this.isAddNewPageDisabled = false;
    this.isRemovePageDisabled = true;
  }
  ngOnInit() {
    console.log('ngOnInit challenge-you');
    // if not login, go to login page
    if (!this.cs.localStorageItem('isLoggedin')){
      console.log('create-challenge requires login');
      this.router.navigateByUrl('/login').then(nav => {
        console.log(nav); // true if navigation is successful
      }, err => {
        console.log(err) // when there's an error
      });
    }
    // --- ---
    this.layersBtns = [
      null,
      this.importQuestionBtnRef.nativeElement,
      this.hideAnswerBtnRef.nativeElement,
      this.makeHintBtnRef.nativeElement,
      this.addBoxBtnRef.nativeElement,
      this.gameOptionBtnRef.nativeElement,
      null,
      null,
      null,
      null,
      null
    ];
    // DOM
    this.gameOptionBtn = this.gameOptionsRef.nativeElement;
    this.thumbnailCanvas = this.thumbnailCanvasRef.nativeElement;
    // form
    this.myForm = new FormGroup({
      questionName: new FormControl('', Validators.required),
      topic: new FormControl('', Validators.required),
      subTopic: new FormControl('', Validators.required),
      difficulty: new FormControl(),
      blurLevel: new FormControl(),
      tags: new FormControl()
    });
    this.thumbnailImg = '';
    this.addNewPageBtn = this.addNewPageBtnRef.nativeElement;
    this.removeThisPageBtn = this.removeThisPageBtnRef.nativeElement;
    // pagination
    this.skyboard.currentPageNumber = this.paginationToolNumber;
    this.skyboard.initPaperArr(this.pageSize);
    this.updateAddAndRemovePageButtonUI();
  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit challenge-you');
  }
  // Pagination
  addPage() {
    this.pageSize += 10;
    this.updateAddAndRemovePageButtonUI();
  }
  removePage() {
    this.skyboard.currentPaperArr.splice(this.skyboard.currentPageNumber - 1,1);
    this.skyboard.currentSampleAnswerArr.splice(this.skyboard.currentPageNumber - 1,1);
    this.pageSize -= 10;
    this.skyboard.loadPaperForOnePage(true, true, false);
    this.updateAddAndRemovePageButtonUI();
  }
  onPageChange(event: number) :void{
    console.log('onPageChange');
    // console.log('Old Page = ' + this.skyboard.currentPageNumber);
    // console.log('New Page = ' + event); // or we may use this.paginationToolNumber
    // disable all paging buttons
    this.disableAllPaginationButtons();
    // end skyapp board action
    this.skyboard.activateTool('refresh');
    this.skyboard.activateTool('done');
    // declare & init array of paper json if needed
    this.skyboard.initPaperArr(this.pageSize);
    // save sample data array
    this.skyboard.saveSampleAnswerOfCurrentPage(this.skyboard.currentSampleAnswerArr);
    // hide answer from text item for thumbnail capturing and storing data without answer
    this.skyboard.hideTextOfAllAnswerAndCommentBoxes();
    // save paper array
    this.skyboard.saveCurrentChallengeLayerstoPaper();
    // update current page number
    this.skyboard.currentPageNumber = event;
    // load new page's array
    this.skyboard.loadPaperForOnePage(true, true, false);
    // start control by updating UI
    this.updateAddAndRemovePageButtonUI();
    this.onClickLayerButton('import-question');
  }
  disableAllPaginationButtons() {
    this.isPaginationDisabled = true;
    this.isAddNewPageDisabled = true;
    this.addNewPageBtn.classList.add('btn-disabled');
    this.isRemovePageDisabled = true;
    this.removeThisPageBtn.classList.add('btn-disabled');
  }
  updateAddAndRemovePageButtonUI(){
    this.isPaginationDisabled = false;
    if (this.pageSize >= 150){ // max. 15 pages
      this.isAddNewPageDisabled = true;
      this.addNewPageBtn.classList.add('btn-disabled');
    } else {
      this.isAddNewPageDisabled = false;
      this.addNewPageBtn.classList.remove('btn-disabled');
    }
    if (this.pageSize <= 10) {
      this.isRemovePageDisabled = true;
      this.removeThisPageBtn.classList.add('btn-disabled');
    } else {
      this.isRemovePageDisabled = false;
      this.removeThisPageBtn.classList.remove('btn-disabled');
    }
  }
  // received from skyboard
  onActivateProcess = (jsonMsg: string): void => {
    const msg = JSON.parse(jsonMsg);
    const command = msg[0];
    const data = msg[1];
    // console.log('Run parent process = ' + command); // + ', data = ' + data);
    if (command === 'activate-layer') {
      if (data !== null) {
        if (this.onLayerButton(data)) {
          this.skyboard.activateLayer(data);
        }
      } else {
        console.error('onActivateProcess error - no activate layer number of ' + data);
      }
    } else if (command === 'hide-game-option') {
      this.gameOptionBtn.classList.add('hidden-div');
      this.updateAddAndRemovePageButtonUI();
    } else if (command === 'show-game-option') {
      this.disableAllPaginationButtons();
      this.doCaptureThumbnail();
      this.skyboard.hideAllTools();
      this.skyboard.hideCanvas();
      this.skyboard.hideControlDiv();
      this.gameOptionBtn.classList.remove('hidden-div');
    } else if (command === 'update-form') {
      this.updateForm(data);
    } else if (command === 'update-page-size') {
      this.pageSize = data * 10;
      this.updateAddAndRemovePageButtonUI();
    } else {
      console.error('onActivateProcess error - no defined jsonMsg of ' + jsonMsg);
    }
  }
  doCaptureThumbnail = (): void => {
    const canvas = this.skyboard.canvasRef.nativeElement;
    this.sourceX = -1;
    this.sourceY = -1;
    this.sourceWidth = -1;
    this.sourceHeight = -1;
    if (this.scope.view != null) {
      // get correct size and position of image from canvas
      if (this.scope.view.zoom < 1) {
        console.log('doCaptureThumbnail zoom < 1');
        this.sourceX = 0;
        this.sourceY = 0;
        this.sourceWidth = canvas.clientWidth;
        this.sourceHeight = canvas.clientHeight;
      }else {
        console.log('doCaptureThumbnail zoom >= 1');
        this.sourceX = (canvas.clientWidth - this.skyboard.DEFAULT_BOARD_WIDTH) / 2;
        this.sourceY = 0;
        this.sourceWidth = this.skyboard.DEFAULT_BOARD_WIDTH;
        this.sourceHeight = this.skyboard.DEFAULT_BOARD_HEIGHT;
      }
    }
    // bug: this part should be updated to crop image
    this.boardImage = this.scope.view.element.toDataURL('image/png');
    if (this.myForm.get('blurLevel').value === null) {
      // set default value
      this.myForm.get('blurLevel').setValue('5');
    }
    this.onChangeBlurLevel(this.myForm.get('blurLevel').value);
  }
  // html layer button calls and skyboard calls
  onClickLayerButton = (buttonName: string): void => {
    console.log(buttonName);
    for (let i = 0; i < this.skyboard.LAYERS_NAME.length; i++) {
      if (buttonName === this.skyboard.LAYERS_NAME[i]) {
        this.activateLayerButtonUI(i);
        this.skyboard.activateLayer(buttonName);
        break;
      }
    }
  }
  onLayerButton = (buttonName: string): boolean => {
    console.log(buttonName);
    for (let i = 0; i < this.skyboard.LAYERS_NAME.length; i++) {
      if (buttonName === this.skyboard.LAYERS_NAME[i]) {
        this.activateLayerButtonUI(i);
        return true;
      }
    }
    return false;
  }
  activateLayerButtonUI = (num: number): void => {
    console.log('activate Layer = ' + num);
    if (num >= 0 && num < this.skyboard.LAYERS_NAME.length) {
      for (let i = 0; i < this.skyboard.LAYERS_NAME.length; i++) {
        if (num === i) {
          if (this.layersBtns[i]) {
            this.layersBtns[i].classList.add('current');
          }
        } else {
          if (this.layersBtns[i]) {
            this.layersBtns[i].classList.remove('current');
          }
        }
      }
    } else {
      console.error('activateLayer error - no activate layer number of ' + num);
    }
  }
  onSubmit = (model: any, isValid: boolean): void => {
    console.log('onSubmit');
    this.submitted = true; // set form submit to true
    // check if model is valid
    // console.log(isValid);
    // save thumbnailImg;
    const imgData = this.thumbnailCanvas.toDataURL();
    model['thumbnail'] = imgData;
    model['numberOfPages'] = this.pageSize/10;
    if (model['blurLevel']){
      model['blurLevel'] = parseInt(model['blurLevel']);
    }
    if (model['difficulty']){
      model['difficulty'] = parseInt(model['difficulty']);
    }
    if (model['tags']) {
      let tagsArr = [];
      if (model['tags'].indexOf(',') !== -1) {
        // found at least one ','
        tagsArr = model['tags'].split(',').map(function(item){
          return item.trim();
        });
      } else {
        tagsArr.push(model['tags']);
      }
      model['tags'] = tagsArr;
    }
    if (model['questionName'] && model['topic'] && model['blurLevel'] && model['difficulty'] && model['tags']) {
      this.skyboard.saveChallengeFromPaperArr(model);
    }else {
      console.log('Required data to be inputted before submission.');
    }
  }
  updateForm = (data: string): void => {
    const modelArr = JSON.parse(data);
    this.myForm.get('questionName').setValue(modelArr['questionName']);
    this.myForm.get('topic').setValue(modelArr['topic']);
    this.myForm.get('subTopic').setValue(modelArr['subTopic']);
    this.myForm.get('difficulty').setValue(modelArr['difficulty']);
    this.myForm.get('blurLevel').setValue(modelArr['blurLevel']);
    this.myForm.get('tags').setValue(modelArr['tags'].toString()); // input array to string
  }
  onChangeBlurLevel = (value: number) => {
    console.log('onChangeBlurLevel = ' + value);
    const ctx = this.thumbnailCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const img = new Image;
    img.onload = () => {
      const destX = 0;
      const destY = 0;
      const destWidth = this.thumbnailCanvas.width;
      const destHeight = this.thumbnailCanvas.height;
      ctx.drawImage(img, 0, 0, this.thumbnailCanvas.width, this.thumbnailCanvas.height);
      // draw cropped image
      // ctx.drawImage(img, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, destX, destY, destWidth, destHeight);
      // get the image data to manipulate
      const input = ctx.getImageData(0, 0, this.thumbnailCanvas.width, this.thumbnailCanvas.height);
      const w = input.width;
      const h = input.height;
      const inputData = input.data;
      this.blurImage(value, ctx, w, h, inputData);
    }
    img.src = this.boardImage;
  }
  // min 1, max = 9. integer value
  blurImage = (blurLevel: number, ctx: any, w: number, h: number, inputData: any) => {
    // get an empty slate to put the data into
    const output = ctx.createImageData(this.thumbnailCanvas.width, this.thumbnailCanvas.height);
    const outputData = output.data;
    const filter = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1]
    ];
    const factor = 1 / blurLevel;
    const bias = 5;
    for (let x = 0; x < w;  x++) {
      for (let y = 0; y < h; y++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let filterX = 0;
        let filterY = 0;
        const imgX = ((x - Math.floor(blurLevel / 2) + filterX + w) % w);
        const imgY = ((y - Math.floor(blurLevel / 2) + filterY + h) % h);
        for (filterX = 0; filterX < blurLevel; filterX++) {
          const filterImgX = (imgX + filterX) % w;
          for (filterY = 0; filterY < blurLevel; filterY++) {
            const filterImgY = (imgY + filterY) % h;
            r += inputData[filterImgX * 4 + filterImgY * w * 4] * filter[filterY][filterX];
            g += inputData[filterImgX * 4 + filterImgY * w * 4 + 1] * filter[filterY][filterX];
            b += inputData[filterImgX * 4 + filterImgY * w * 4 + 2] * filter[filterY][filterX];
          }
        }
        if (imgX > (blurLevel / 2 + 2) && imgY > (blurLevel / 2 + 2) &&
            imgX < (w - blurLevel / 2 - 2) && imgY < (h - blurLevel / 2 - 2) ) { // rgb
          outputData[imgX * 4 + imgY * w * 4] = Math.min(Math.max(Math.floor(factor * r + bias), 0), 255);
          outputData[imgX * 4 + imgY * w * 4 + 1] = Math.min(Math.max(Math.floor(factor * g + bias), 0), 255);
          outputData[imgX * 4 + imgY * w * 4 + 2] = Math.min(Math.max(Math.floor(factor * b + bias), 0), 255);
        }else { // alpha
          outputData[imgX * 4 + imgY * w * 4] = inputData[imgX * 4 + imgY * w * 4 + 3];
          outputData[imgX * 4 + imgY * w * 4 + 1] = inputData[imgX * 4 + imgY * w * 4 + 3];
          outputData[imgX * 4 + imgY * w * 4 + 2] = inputData[imgX * 4 + imgY * w * 4 + 3];
        }
        outputData[imgX * 4 + imgY * w * 4 + 3] = inputData[imgX * 4 + imgY * w * 4 + 3];
      }
    }
    // put the image data back after manipulation
    ctx.putImageData(output, 0, 0);
  }
}



