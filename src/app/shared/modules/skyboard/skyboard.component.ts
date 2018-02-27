import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SkyboardDialogComponent} from './skyboard-dialog/skyboard-dialog.component';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ISubscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as paper from 'paper';
import * as FileSaver from 'file-saver';
import {SkyboardService} from "./skyboard.service";
import {CommonService} from "../../services/common-service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'app-skyboard',
  providers: [SkyboardService, CommonService],
  templateUrl: './skyboard.component.html',
  styleUrls: ['./skyboard.component.scss']
})

export class SkyboardComponent implements OnInit, AfterViewInit, OnDestroy { //
  public readonly SELECTION_STROKE_WIDTH = 2;
  public readonly SELECTION_RECT_STROKE_COLOR = '#009DEC';
  public readonly CONTROLLER_RADIUS = 10;
  public readonly CONTROLLER_STROKE_COLOR = '#009DEC';
  public readonly CONTROLLER_FILL_COLOR = '#e9f7fe';
  public readonly MIN_LENGTH_OF_SCALING_BOUND = 25;
  public readonly SCALING_BOUND_STROKE_WIDTH = 1;
  public readonly SCALING_BOUND_STROKE_COLOR = '#99949b';
  public readonly SELECTABLE_BOUND_STROKE_WIDTH = 3;
  public readonly SELECTABLE_BOUND_STROKE_COLOR = '#99949b';
  public readonly DISTANCE_BETWEEN_CONTROLLER_AND_ITEM = 25;
  public readonly ZOOM_FACTOR = 1.25;
  public readonly MIN_ZOOM = 0.4;
  public readonly MAX_ZOOM = 2;
  public readonly DEFAULT_BOARD_WIDTH = 595;
  public readonly DEFAULT_BOARD_HEIGHT = 842;
  public readonly ALLOWED_TRANSFORM_GAP = 0; // 50
  public readonly MAX_NUMBER_OF_PATHS_IN_A_GROUP = 500;
  public readonly ROUND_ANSWER_BOX_RADIUS = 10;
  public readonly DEFAULT_FONT_SIZE = 16;
  public readonly OBJECTS_LIST = [
    'stroke-path',
    'stroke-path-group',
    'circle',
    'rectangle',
    'line',
    'arrow-line-component',
    'arrow-line-group',
    'text',
    'picture',
    'answer-box',
    'answer-box-json',
    'answer-box-group',
    'comment-box',
    'comment-box-json',
    'comment-box-group',
    'selection-rectangle', // useless
    'paths-group',
    'top-left-button',
    'bottom-left-button',
    'top-right-button',
    'bottom-right-button',
    'top-button', // not exist now
    'right-button', // not exist now
    'bottom-button', // not exist now
    'left-button', // not exist now
    'transform-controllers-group',
    'rotate-button-component',
    'rotate-button-group',
    'edit-button',
    'dashed-border',
    'mask',
    'white-board',
    'link-box',
    'link-text',
    'link-box-json',
    'link-box-group',
    'dashed-border-for-object',
    'answer-box-text',
    'comment-box-text',
    'answer-box-from-teacher',
    'answer-box-json-from-teacher',
    'answer-box-text-from-teacher',
    'answer-box-group-from-teacher',
    'comment-box-from-teacher',
    'comment-box-json-from-teacher',
    'comment-box-text-from-teacher',
    'comment-box-group-from-teacher',
    'link-box-from-teacher',
    'link-box-json-from-teacher',
    'link-text-from-teacher',
    'link-box-group-from-teacher',
    'dashed-border-for-wrong-answer',
  ];
  public readonly LAYERS_NAME = [
    'background',       // 0 - background
    'import-question',  // 1 - questions (with mask)                  // Step 1 - create-challenge
    'hide-answer',      // 2 - items to modify questions (with mask)  // Step 2 - create-challenge
    'make-hint',        // 3 - hints objects (with mask)              // Step 3 - create-challenge
    'add-box',          // 4 - answers icons (with mask)              // Step 4 - create-challenge
    'game-option',      // 5 - game option, not using now (with mask) // Step 5 - create-challenge
    'student-work',     // 6 - student work (with mask)               // Step 6 - challenge-you
    'student-emoji',    // 7 - student emoji (with mask)              // Step 7 - challenge-you
    'others-work',      // 8 - other people work (with mask)          // Step 8 - other-function
    'others-emoji',     // 9 - other people emoji (with mask)         // Step 9 - other-function
    'temp-layer',       // 10 - temp drawing layer (with mask)        // Step 10 - temp for all functions
  ];
  public readonly TOOLS_NAME = [
    'nothing', 'transform', 'zoom-in', 'zoom-out', 'refresh',
    'pen', 'circle', 'square', 'done', 'normal-line',
    'arrow-line', 'text', 'file-input', 'answer-box', 'comment-box',
    'move-top', 'move-up', 'move-down', 'move-bottom', 'duplicate',
    'remove', 'link'
  ];
  public readonly BOOL_ENABLE_BUTTON = [
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // layer 0 background - currently unreachable
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1], // layer/step 1
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0], // layer/step 2
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1], // layer/step 3
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0], // layer/step 4
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // step 5 game option - lock buttons
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1], // step 6
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // step 7
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // step 8
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // step 9
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // step 10
  ];
  public readonly CONTROL_ITEM_NAMES_FOR_EDIT = [
    'text',
    'answer-box-group',
    'comment-box-group',
    'link-box-group'
  ];
  public readonly ACTIVATE_TOOL_NAMES_FOR_EDIT = [
    'text',
    'answer-box',
    'comment-box',
    'link'];
  public readonly DIALOG_LIMIT_WIDTH = 450;
  public readonly DIALOG_LIMIT_HEIGHT = 450;
  public readonly DIALOG_SMALL_WIDTH = 250;
  public readonly DIALOG_SMALL_HEIGHT = 250;

  // html elements
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @ViewChild('nothingBtn') nothingBtnRef: ElementRef;
  @ViewChild('transformBtn') transformBtnRef: ElementRef;
  @ViewChild('zoomInBtn') zoomInBtnRef: ElementRef;
  @ViewChild('zoomOutBtn') zoomOutBtnRef: ElementRef;
  @ViewChild('refreshBtn') refreshBtnRef: ElementRef;
  @ViewChild('penBtn') penBtnRef: ElementRef;
  @ViewChild('circleBtn') circleBtnRef: ElementRef;
  @ViewChild('squareBtn') squareBtnRef: ElementRef;
  @ViewChild('normalLineBtn') normalLineBtnRef: ElementRef;
  @ViewChild('arrowLineBtn') arrowLineBtnRef: ElementRef;
  @ViewChild('textBtn') textBtnRef: ElementRef;
  @ViewChild('fileInputBtn') fileInputBtnRef: ElementRef;
  @ViewChild('answerBoxBtn') answerBoxBtnRef: ElementRef;
  @ViewChild('commentBoxBtn') commentBoxBtnRef: ElementRef;
  @ViewChild('moveTopBtn') moveTopBtnRef: ElementRef;
  @ViewChild('moveUpBtn') moveUpBtnRef: ElementRef;
  @ViewChild('moveDownBtn') moveDownBtnRef: ElementRef;
  @ViewChild('moveBottomBtn') moveBottomBtnRef: ElementRef;
  @ViewChild('duplicateBtn') duplicateBtnRef: ElementRef;
  @ViewChild('removeBtn') removeBtnRef: ElementRef;
  @ViewChild('linkBtn') linkBtnRef: ElementRef;
  @ViewChild('allTools') allToolsRef: ElementRef;
  @ViewChild('canvasDiv') canvasDivRef: ElementRef;
  @ViewChild('controlDiv') controlDivRef: ElementRef;
  @ViewChild('boxToolDiv') boxToolDivRef: ElementRef;

  // for init input
  @Input('mode') mode: string;
  @Input('initialActiveLayerName') initialActiveLayerName: string;
  @Input('initialActiveToolName') initialActiveToolName: string;
  @Input('scopeFromParent') scope: paper.PaperScope;
  @Output() onActivateProcess: EventEmitter<string> = new EventEmitter<string>();

  // DOM objects reference
  canvas: any;
  allTools: any;
  canvasDiv: any;
  controlDiv: any;
  boxToolDiv: any;

  // tools variables
  btns = [];
  tools = [];

  // Transformation Variables
  oriLength: number; // control of scaling
  oriRotation: number; // control of rotation
  boolTransformed: boolean; // control of moving
  lastEventPoint: paper.Point; // pan view
  oriRect: paper.Rectangle; // get item's bounds before transformation
  rotateController: paper.Group; // for rotation
  editBtn: paper.Raster; // for edit functions, call context button
  itemBound: paper.Path.Rectangle; // bounds control item in scaling and rotation
  controlItem: paper.Item; // identify item
  controllersGroup: paper.Group; // for scaling controllers
  hitOptions = {segments: true, stroke: true, fill: true, tolerance: 5}; // for hit test
  currentToolNumber: number;
  transformTouchedObjectChecked: boolean;
  transformTouchedObjectPass: boolean;
  selectedBoxFromTeacher: paper.Item;

  // Drawing
  color = '#127bdc';
  tempPath: paper.Path;
  tempPathArr = []; // max size = 500
  currentPathNumber = 0;
  tempGroup: paper.Group;
  dashedBorder: paper.Path.Rectangle;
  currentActiveLayerNumber: number;
  // Circle, Square, Line, Arrow Line
  firstPoint: paper.Point;
  // text, answer, comment, link
  boolCreatedBox = false;
  isEdit = false; // for init value
  isBoxClickByStudent = false; // for init value
  tempID: number;
  // File Upload
  // url = 'http://paperjs.org/tutorials/images/working-with-rasters/mona.jpg';
  myTempFileData: any;
  myFileReader: any;
  trackingRaster: paper.Raster;

  // control grid
  showDoneDiv: boolean;
  showTextInputBoxDiv: boolean;
  showCaseSensitiveDiv: boolean;
  showTextAreaDiv: boolean;
  showSubmitDiv: boolean;
  showViewLinkDiv: boolean;
  disableCaseSensitive: boolean;
  tempCaseSensitive: boolean;
  tempTextOfInput: string;
  tempTextOfTextArea: string;
  tiPlaceholder: string;
  taPlaceholder: string;

  // dialog
  dialogRef: MatDialogRef<SkyboardDialogComponent> | null;

  // Answer
  mapModelIdToSampleAnswer: Object;
  mapModelIdToSampleComment: Object;
  mapQuestionBoxIdtoModelId: Object;
  mapInviBoxIdtoModelId: Object;
  mapInviBoxIdtoQuestionBox: Object;

  textInputFormControl = new FormControl({value: '', disabled: true}, [Validators.required]);
  textAreaFormControl = new FormControl({value: '', disabled: true});

  // import when open the page in view-challenge
  modelArr: any;
  submitArr: any;

  // players marks related
  avgCorrectF: number;
  avgTS: number;

  // bar chart number of players vs marks
  playerMarksChartData: Array<any> = [
    { data: [0, 0], label: 'Number of Players' }
  ];
  playerMarksChartLabels: string[] = ['0', '1'];
  playerMarksChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  };
  playerMarksChartLegend: boolean = true;
  playerMarksChartType: string = 'bar';
  // pie chart time spent
  playerTSChartLabels: string[] = ['a', 'b', 'c', 'd'];
  playerTSChartData: number[] = [1, 2, 3, 4];
  playerTSChartType: string = 'pie';
  // bar Chart player answers
  playersAnswersChartLabel: string[] = ['Ans 1', 'Ans 2', 'Ans 3', 'Ans 4', 'Ans 5'];
  playersAnswersChartType: string = 'bar';
  playersAnswersChartLegend: boolean = true;
  playersAnswersChartData: any[] = [
    {data: [25, 59, 80, 81, 30], label: 'Wrong'},
    {data: [124, 5, 6, 2, 4], label: 'Correct'}
  ];
  playersAnswersChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  };
  // player's Correct and Wrong (CW) chart for answer id
  playerCWChartDataForAnswerID = {
    "1": [2, 4],
    "2": [6, 7]
  };
  playerCWChartLabelForAnswerID = ['Wrong', 'Correct'];
  playerCWChartTypeForAnswerID = 'pie';
  // player's Submitted Answers (SA) chart for answer id
  playerSAChartDataForAnswerID = {
    "1": [1,2,3,4,5],
    "2": [1,2,3,4,5]
  };
  playerSAChartLabelForAnswerID = {
    "1": ['A', 'B', 'C', 'D', 'E'],
    "2": ['D', 'E', 'F', 'G', 'F']
  };
  playerSAChartOptionForAnswerID: any = {
    responsive: true
  };
  playerSAChartLegendForAnswerID: boolean = true;
  playerSAChartTypeForAnswerID:string = 'pie';
  playersMarksArr = [];
  playersTSArr = [];
  rank = 0;
  rankTotal = 0;
  // pagination
  currentPageNumber: number;
  currentPaperArr = [];
  currentSampleAnswerArr = [];
  // Timer
  // tLastAccept: any;

  // Subscription
  private importEditChallengeSubscription: ISubscription;
  private importViewChallengeSubscription: ISubscription;
  private closeDialogSubscription: ISubscription;

  constructor(
    private translate: TranslateService,
    public dialog: MatDialog,
    private http: Http,
    private skyboardService: SkyboardService,
    public cs: CommonService,
    private router: Router
  ) {
    // --- declare buttons & tools---
    this.currentActiveLayerNumber = 0;
    for (let i = 0; i < this.TOOLS_NAME.length; i++) {
      this.tools[i] = new paper.Tool();
    }
    this.transformTouchedObjectChecked = false;
    this.transformTouchedObjectPass = false;
    this.resetControlGridValues();
  }

  ngOnInit() {
    console.log('ngOnInit skyboard');

    // linking of DOM elements
    this.canvas = this.canvasRef.nativeElement;
    this.canvasDiv = this.canvasDivRef.nativeElement;
    this.allTools = this.allToolsRef.nativeElement;
    this.controlDiv = this.controlDivRef.nativeElement;
    this.boxToolDiv = this.boxToolDivRef.nativeElement;

    // --- init board's view ---
    window.onresize = this.resizeCanvas.bind(this);

    // --- Testing Layer ---
    // const foregroundLayer = this.layers[1];
    // foregroundLayer.activate();

    // --- Transformation Tool ---
    // #0 is nothing, just view
    const transformationTool = this.tools[1];
    transformationTool.onMouseDown = this.transformationToolMouseDown;
    transformationTool.onMouseDrag = this.transformationToolMouseDrag;
    transformationTool.onMouseUp = this.transformationToolMouseUp;
    // transformationTool.onMouseMove = this.transformationToolMouseMove;
    // --- Zoom in Tool ---
    const zoomInTool = this.tools[2];
    zoomInTool.onMouseDown = this.zoomInToolMouseDown;
    // --- Zoom Out Tool ---
    const zoomOutTool = this.tools[3];
    zoomOutTool.onMouseDown = this.zoomOutToolMouseDown;
    // --- Pen Tool ---
    const penTool = this.tools[5];
    penTool.onMouseDown = this.penToolMouseDown;
    penTool.onMouseDrag = this.penToolMouseDrag;
    penTool.onMouseUp = this.penToolMouseUp;
    // --- Circle Tool ---
    const circleTool = this.tools[6];
    circleTool.onMouseDown = this.circleToolMouseDown;
    circleTool.onMouseDrag = this.circleToolMouseDrag;
    circleTool.onMouseUp = this.circleToolMouseUp;
    // --- Square Tool ---
    const squareTool = this.tools[7];
    squareTool.onMouseDown = this.squareToolMouseDown;
    squareTool.onMouseDrag = this.squareToolMouseDrag;
    squareTool.onMouseUp = this.squareToolMouseUp;
    // --- Normal Line Tool ---
    const normalLineTool = this.tools[9];
    normalLineTool.onMouseDown = this.normalLineToolMouseDown;
    normalLineTool.onMouseDrag = this.normalLineToolMouseDrag;
    normalLineTool.onMouseUp = this.normalLineToolMouseUp;
    // --- Arrow Line Tool ---
    const arrowLineTool = this.tools[10];
    arrowLineTool.onMouseDown = this.arrowLineToolMouseDown;
    arrowLineTool.onMouseDrag = this.arrowLineToolMouseDrag;
    arrowLineTool.onMouseUp = this.arrowLineToolMouseUp;
    // --- Text Tool ---
    const textTool = this.tools[11];
    textTool.onMouseDown = this.textToolMouseDown;
    textTool.onMouseDrag = this.textToolMouseDrag;
    textTool.onMouseUp = this.textToolMouseUp;
    // --- File Selection Tool ---
    const fileSelectionTool = this.tools[12];
    fileSelectionTool.onMouseDown = this.fileSelectionToolMouseDown;
    fileSelectionTool.onMouseDrag = this.fileSelectionToolMouseDrag;
    fileSelectionTool.onMouseUp = this.fileSelectionToolMouseUp;
    // --- Answer Box Creation Tool ---
    const answerBoxTool = this.tools[13];
    answerBoxTool.onMouseDown = this.answerBoxToolMouseDown;
    answerBoxTool.onMouseDrag = this.answerBoxToolMouseDrag;
    answerBoxTool.onMouseUp = this.answerBoxToolMouseUp;
    // --- Comment Box Creation Tool ---
    const commentBoxTool = this.tools[14];
    commentBoxTool.onMouseDown = this.commentBoxToolMouseDown;
    commentBoxTool.onMouseDrag = this.commentBoxToolMouseDrag;
    commentBoxTool.onMouseUp = this.commentBoxToolMouseUp;
    // --- Link Creation Tool ---
    const linkTool = this.tools[21];
    linkTool.onMouseDown = this.linkToolMouseDown;
    linkTool.onMouseDrag = this.linkToolMouseDrag;
    linkTool.onMouseUp = this.linkToolMouseUp;
    // --- Nothing Tool ---

    // tool buttons
    this.btns = [
      this.nothingBtnRef.nativeElement,
      this.transformBtnRef.nativeElement,
      this.zoomInBtnRef.nativeElement,
      this.zoomOutBtnRef.nativeElement,
      this.refreshBtnRef.nativeElement,
      this.penBtnRef.nativeElement,
      this.circleBtnRef.nativeElement,
      this.squareBtnRef.nativeElement,
      null,
      this.normalLineBtnRef.nativeElement,
      this.arrowLineBtnRef.nativeElement,
      this.textBtnRef.nativeElement,
      this.fileInputBtnRef.nativeElement,
      this.answerBoxBtnRef.nativeElement,
      this.commentBoxBtnRef.nativeElement,
      this.moveTopBtnRef.nativeElement,
      this.moveUpBtnRef.nativeElement,
      this.moveDownBtnRef.nativeElement,
      this.moveBottomBtnRef.nativeElement,
      this.duplicateBtnRef.nativeElement,
      this.removeBtnRef.nativeElement,
      this.linkBtnRef.nativeElement
    ];
    // reload board
    this.scope.setup(this.canvas);

    // force adjust zoom at the beginning
    this.resizeCanvas(null);
    // --- Set Masks of Layers ---
    for (let i = 0; i < this.LAYERS_NAME.length; i++) {
      this.initLayer(i);
    }

    // init layer
    if (this.initialActiveLayerName !== 'temp-layer') {
      // edit or play mode
      const jsonMsg = JSON.stringify(['activate-layer', this.initialActiveLayerName]);
      this.onActivateProcess.emit(jsonMsg);
    } else {
      // view-mode
      console.log('init layer with view mode')
      const jsonMsg = JSON.stringify(['activate-layer-for-view', this.initialActiveLayerName]);
      this.onActivateProcess.emit(jsonMsg);
    }

    this.activateTool(this.initialActiveToolName);

    // testing - by file input
    this.modelArr = '{"questionName":"1","topic":"2","subTopic":"3","difficulty":4,"blurLevel":8,"tags":["567","4134"],"thumbnail":"data:image/png;base64,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","paperVersion":1.1,"paper":[[[75,"stroke-path-group","[\\"Group\\",{\\"name\\":\\"stroke-path-group\\",\\"applyMatrix\\":true,\\"children\\":[[\\"Path\\",{\\"name\\":\\"stroke-path\\",\\"applyMatrix\\":true,\\"segments\\":[[[131.43519,71.55556],[0,0],[0,5.18225]],[[118.84259,87.2963],[0,-10.23385],[0,16.33301]],[[129.86111,136.09259],[-3.91012,-15.64048],[0.37925,1.51701]],[[134.58333,158.12963],[-0.97585,0],[29.56269,0]],[[184.9537,74.7037],[0,21.86065],[0,-1.57407]],[[184.9537,79.42593],[0,-1.57407],[0,2.62346]],[[184.9537,87.2963],[0.26104,-2.61044],[-0.51618,5.16183]],[[189.67593,118.77778],[-10.13706,0],[0,0]]],\\"strokeColor\\":[0.07059,0.48235,0.86275]}]]}]"],[111,"circle","[\\"Path\\",{\\"name\\":\\"circle\\",\\"applyMatrix\\":true,\\"segments\\":[[[240.98988,101.46296],[0,31.64435],[0,-31.64435]],[[298.28704,44.1658],[-31.64435,0],[31.64435,0]],[[355.5842,101.46296],[0,-31.64435],[0,31.64435]],[[298.28704,158.76012],[31.64435,0],[-31.64435,0]]],\\"closed\\":true,\\"fillColor\\":[0.07059,0.48235,0.86275]}]"],[157,"rectangle","[\\"Path\\",{\\"name\\":\\"rectangle\\",\\"applyMatrix\\":true,\\"segments\\":[[419.49074,128.22222],[419.49074,58.96296],[513.93519,58.96296],[513.93519,128.22222]],\\"closed\\":true,\\"fillColor\\":[0.92549,0.25098,0.25098]}]"],[171,"line","[\\"Path\\",{\\"name\\":\\"line\\",\\"applyMatrix\\":true,\\"segments\\":[[77.91667,221.09259],[177.08333,277.75926]],\\"strokeColor\\":[1,0.96078,0]}]"],[234,"arrow-line-group","[\\"Group\\",{\\"name\\":\\"arrow-line-group\\",\\"applyMatrix\\":true,\\"children\\":[[\\"Path\\",{\\"name\\":\\"arrow-line-component\\",\\"applyMatrix\\":true,\\"segments\\":[[222.73148,287.2037],[304.58333,224.24074]],\\"strokeColor\\":[0.91373,0.12549,0.91373]}],[\\"Path\\",{\\"name\\":\\"arrow-line-component\\",\\"applyMatrix\\":true,\\"segments\\":[[302.53088,230.13909],[304.58333,224.24074]],\\"strokeColor\\":[0.91373,0.12549,0.91373]}],[\\"Path\\",{\\"name\\":\\"arrow-line-component\\",\\"applyMatrix\\":true,\\"segments\\":[[298.35586,224.71157],[304.58333,224.24074]],\\"strokeColor\\":[0.91373,0.12549,0.91373]}]]}]"],[241,"text","[\\"PointText\\",{\\"name\\":\\"text\\",\\"applyMatrix\\":false,\\"matrix\\":[1,0,0,1,347.08333,252.57407],\\"content\\":\\"123\\",\\"fontSize\\":16,\\"leading\\":19.2}]"],[318,"link-box-group","[\\"Group\\",{\\"name\\":\\"link-box-group\\",\\"applyMatrix\\":true,\\"children\\":[[\\"Path\\",{\\"name\\":\\"link-box\\",\\"applyMatrix\\":true,\\"segments\\":[[439.9537,284.05556],[414.76852,243.12963],[439.9537,202.2037],[490.32407,202.2037],[515.50926,243.12963],[490.32407,284.05556]],\\"closed\\":true,\\"fillColor\\":[1,1,1],\\"strokeColor\\":[0,0,0]}],[\\"PointText\\",{\\"name\\":\\"link-text\\",\\"applyMatrix\\":false,\\"matrix\\":[1.54398,0,0,1.54398,434.91667,250.54074],\\"content\\":\\"apple\\",\\"fontSize\\":16,\\"leading\\":19.2}],[\\"PointText\\",{\\"name\\":\\"link-box-json\\",\\"applyMatrix\\":false,\\"matrix\\":[1,0,0,1,465.13889,243.12963],\\"visible\\":false,\\"content\\":\\"[\\\\\\"apple\\\\\\",\\\\\\"www.apple.com\\\\\\"]\\"}]]}]"],[338,"picture","[\\"Raster\\",{\\"name\\":\\"picture\\",\\"applyMatrix\\":false,\\"matrix\\":[0.21526,0,0,0.21526,293.56481,362.75926],\\"crossOrigin\\":\\"\\",\\"source\\":\\"data:image/png;base64,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V1hYKD8voEYnu69rt9HWfRFB3x7VqxvTZ7hwjhf+DZNu/jOe3rUXM5ttqtIpWTlxALNlRGNcdh4en+6ht61TEvIuIV5vtHkXLuaGBEiABM55At3JaGurMFsz2toKfzau7V23REa80pxJRyZlIfuP92CQq8GklvsEmVCZWYT8BGN01RnB5w/qsDoqBAtCslC76R59RLIzVaLRJvZIe0faOhO8r8n6OSNtvqYj83v2CdBoO/tlwByQAAmQgDcRoNFmlIYvGG16Tu0jVDK8pc9M86a65Ot5odEmRpsUYrumR/p6YTP/JEACJEACJEACJOBrBEqPqLXr3dvVHN7fvQFQexIQAhxpa0c1UCNt7Vz61w5pDEICrRNgPZPdRTlnnQzk9mA9IAP1lGQ9MJZndPf2B+sB7wU+DxQBoMWW/4Y3P0mABEiABEiABEiABEiABEiABLyBAI02bygF5oEESIAESIAESIAESIAESIAEPBCg0eYBDL1JgARIgARIgARIgARIgARIwBsI0GjzhlJgHkiABEiABEiABEiABEiABEjAAwEabR7A0JsESIAESIAESIAESIAESIAEvIEAjTZvKAXmgQRIgARIgARIgARIgARIgAQ8EKDR5gEMvUmABEiABEiABEiABEiABEjAGwjQaPOGUmAeSIAESIAESIAESIAESIAESMADARptHsDQmwRIgARIgARIgARIgARIgAS8gQCNNm8oBeaBBEiABEiABEiABEiABEiABDwQoNHmAQy9SYAESIAESIAESIAESIAESMAbCNBo84ZSYB5IgARIgARIgARIgARIgARIwAMBGm0ewNCbBEiABEiABEiABEiABEiABLyBAI02bygF5oEESIAESIAESIAESIAESIAEPBDw27Vrl+bhGr3tBKZMmQLhRB4k0KUEWM+6FC+FkwAJkIDPEeB7weeKjBkmgS4j4KeJ6zLp54hgPz8/ENM5UpherAbrGVBYWIiIiAgvLqWuzxoZsB6oWsZ6QAaqHvC9wHrA54EiwHqgGHB6pKJARwIkQAIkQAIkQAIkQAIkQAJeSoBGm5cWDLNFAiRAAiRAAiRAAiRAAiRAAoqAvxODrQ4VldX20wD0HTwIwU1XncG6/YG1BmXl1egbNgJ9An2bRl1VGQ4e+R7n97sYI4eGulQG39aLuScBEiABEiABEiABEiCBc4mAc6St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\\"}]"]],[],[],[[420,"answer-box-group","[\\"Group\\",{\\"name\\":\\"answer-box-group\\",\\"applyMatrix\\":true,\\"children\\":[[\\"Path\\",{\\"name\\":\\"answer-box\\",\\"applyMatrix\\":true,\\"segments\\":[[[91.572,528.48342],[0,0],[-3.43284,0]],[[84.70633,521.61774],[0,3.43284],[0,0]],[[84.70633,468.34522],[0,0],[0,-3.43284]],[[91.572,461.47955],[-3.43284,0],[0,0]],[[224.81689,461.47955],[0,0],[3.43284,0]],[[231.68256,468.34522],[0,-3.43284],[0,0]],[[231.68256,521.61774],[0,0],[0,3.43284]],[[224.81689,528.48342],[3.43284,0],[0,0]]],\\"closed\\":true,\\"fillColor\\":[1,1,1],\\"strokeColor\\":[0,0,0]}],[\\"PointText\\",{\\"name\\":\\"answer-box-json\\",\\"applyMatrix\\":false,\\"matrix\\":[0.68657,0,0,0.68657,158.19444,494.98148],\\"visible\\":false,\\"content\\":\\"[\\\\\\"\\\\\\",\\\\\\"\\\\\\",true,420]\\"}],[\\"PointText\\",{\\"name\\":\\"answer-box-text\\",\\"applyMatrix\\":false,\\"matrix\\":[3.3153,0,0,3.3153,143.44397,510.8949],\\"content\\":\\"_\\",\\"fontSize\\":16,\\"leading\\":19.2}]]}]"],[531,"answer-box-group","[\\"Group\\",{\\"name\\":\\"answer-box-group\\",\\"applyMatrix\\":true,\\"children\\":[[\\"Path\\",{\\"name\\":\\"answer-box\\",\\"applyMatrix\\":true,\\"segments\\":[[[259.49074,521.74074],[0,0],[-5,0]],[[249.49074,511.74074],[0,5],[0,0]],[[249.49074,484.51852],[0,0],[0,-5]],[[259.49074,474.51852],[-5,0],[0,0]],[[352.82407,474.51852],[0,0],[5,0]],[[362.82407,484.51852],[0,-5],[0,0]],[[362.82407,511.74074],[0,0],[0,5]],[[352.82407,521.74074],[5,0],[0,0]]],\\"closed\\":true,\\"fillColor\\":[1,1,1],\\"strokeColor\\":[0,0,0]}],[\\"PointText\\",{\\"name\\":\\"answer-box-json\\",\\"applyMatrix\\":false,\\"matrix\\":[1,0,0,1,306.15741,498.12963],\\"visible\\":false,\\"content\\":\\"[\\\\\\"\\\\\\",\\\\\\"\\\\\\",false,531]\\"}],[\\"PointText\\",{\\"name\\":\\"answer-box-text\\",\\"applyMatrix\\":false,\\"matrix\\":[2.33652,0,0,2.33652,295.76174,509.34491],\\"content\\":\\"_\\",\\"fontSize\\":16,\\"leading\\":19.2}]]}]"],[656,"comment-box-group","[\\"Group\\",{\\"name\\":\\"comment-box-group\\",\\"applyMatrix\\":true,\\"children\\":[[\\"Path\\",{\\"name\\":\\"comment-box\\",\\"applyMatrix\\":true,\\"segments\\":[[[414.76852,496.55556],[0,4.60718],[0,-11.30138]],[[450.97222,476.09259],[-19.99475,0],[19.99475,0]],[[487.17593,496.55556],[0,-11.30138],[0,11.30138]],[[450.97222,517.01852],[19.99475,0],[-8.15117,0]],[[429.24788,512.92652],[6.05116,2.56942],[0,0]],[414.76852,517.01852],[[422.0082,508.83453],[0,0],[-4.5459,-3.42022]]],\\"closed\\":true,\\"fillColor\\":[1,1,1],\\"strokeColor\\":[0,0,0]}],[\\"PointText\\",{\\"name\\":\\"comment-box-json\\",\\"applyMatrix\\":false,\\"matrix\\":[1,0,0,1,450.97222,496.55556],\\"visible\\":false,\\"content\\":\\"[\\\\\\"\\\\\\",\\\\\\"\\\\\\",\\\\\\"\\\\\\",656]\\"}],[\\"PointText\\",{\\"name\\":\\"comment-box-text\\",\\"applyMatrix\\":false,\\"matrix\\":[2.02498,0,0,2.02498,441.96264,506.27546],\\"content\\":\\"_\\",\\"fontSize\\":16,\\"leading\\":19.2}]]}]"]]],"sampleAnswers":[["1","1",true,420],["2","",false,531],[null,"3",null,656]]}';
    this.resetObjectsAndArrays();
    /*
    this.submitArr = {
      "_id" : "5a55f59ba6c0ef0c67fbfebe",
      "ownerId" : "5a11ba5d02e3390bccfd1e63",
      "ownerName" : "Leo Yeung",
      "questionId" : "12345",
      "tLastAccept" : new Date("2018-01-10T11:14:35.317Z"),
      "tLastUpdate" : new Date("2018-01-10T11:14:35.317Z"),
      "tFirstAccept" : new Date("2018-01-10T11:14:35.317Z"),
      "log" : [ ],
      "paper" : [ ],
      "paperVersion" : 1.1,
      "numOfSubmission" : 0,
      "timeSpentF" : 0,
      "timeSpentCurrent" : 0,
      "answersC" : [ ],
      "answersF" : [ ],
      "wrongC" : 0,
      "wrongF" : 0,
      "correctC" : 0,
      "correctF" : 0,
      "markPercentageC" : 0,
      "markPercentageF" : 0,
      "__v" : 0
    }
    */

    // textObject.name = 'paths group';
    // textObject.fitBounds(this.scope.view.bounds);
    // textObject.scale(1);
    // path.fitBounds(view.bounds);
    // textObject.scale(1);
    // path.scale(10);
    // path.position = new paper.Point(this.DEFAULT_BOARD_WIDTH / 2, this.DEFAULT_BOARD_HEIGHT / 2);

    // --- testing ---
    /*
     this.layers[1].addChild(new paper.Path.Circle({
     center: [80, 50],
     radius: 35,
     fillColor: 'red',
     strokeColor: 'yellow'
     }));
     this.layers[1].addChild(new paper.Path.Rectangle({
     x: 180,
     y: 120,
     width: 35,
     height: 75,
     fillColor: 'red',
     strokeColor: 'yellow'
     }));
     this.layers[1].addChild(new paper.Raster({
     source: 'assets/icons/smallicon.png',
     position: new paper.Point(this.DEFAULT_BOARD_WIDTH / 2, this.DEFAULT_BOARD_HEIGHT / 2)
     }));
     */
    // console.log(this.scope.project.exportJSON());
  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit skyboard');
    this.resizeCanvas(null);
  }
  ngOnDestroy() {
    console.log('skyboard - ngOnDestroy');
    this.scope.project.clear();
    if (this.importEditChallengeSubscription) {
      this.importEditChallengeSubscription.unsubscribe();
    }
    if (this.importViewChallengeSubscription) {
      this.importViewChallengeSubscription.unsubscribe();
    }
    if (this.closeDialogSubscription) {
      this.closeDialogSubscription.unsubscribe();
    }
  }
  // ---------------------------------
  // --- For Create Challenge --------
  // ---------------------------------
  onClickPreviousStep = (): void => {
    const newStep = this.currentActiveLayerNumber - 1;
    this.callNewLayerFromStepButton(newStep);
  }
  onClickNextStep = (): void => {
    const newStep = this.currentActiveLayerNumber + 1;
    this.callNewLayerFromStepButton(newStep);
  }
  // ---------------------------------
  // --- For Create Challenge (End)---
  // ---------------------------------
  onClickSubmit = (): void => {
    console.log('onClickSubmit');
    if (this.isTesting()){
      console.log('is testing');
      const jsonMsg = JSON.stringify(['change-stage-to-view', 'testing']);
      this.onActivateProcess.emit(jsonMsg);
    }else {
      this.showSubmitDiv = false;
      this.removeDashedBordersForAllObjects();
      this.activateTool('refresh');
      this.activateTool('done');
      const numberOfPages = this.modelArr['numberOfPages'];
      const inputtedAllAnswers = this.checkInputtedAnswersForAllAnswersBoxesInThePage();
      if (inputtedAllAnswers && this.currentPageNumber === numberOfPages) {
        this.savePageInPlayMode();
        let correctNoOfAnswer = 0;
        let totalNoOfAnswer = 0;
        const answersArr = this.submitArr['answersC'];
        console.log('answersArr');
        console.log(answersArr);
        const isFirstTime = (this.submitArr['tLastSubmit'] === undefined)? true : false;
        // init submitted answers
        let submittedAnswersArr;
        if (isFirstTime) {
          submittedAnswersArr = new Array();
          for (let i = 0; i < answersArr.length; i++) {
            for (let j = 0; j < answersArr[i].length; j++) {
              const cs = answersArr[i][j][2];
              if (cs !== "" && cs !== null) { // = answer box, ignore comment box
                const mid = answersArr[i][j][3];
                submittedAnswersArr.push(new Array(mid, 0, new Array()));
              }
            }
          }
        } else {
          submittedAnswersArr = this.submitArr['submittedAnswers'];
        }
        for (let i = 0; i < answersArr.length; i++) {
          for (let j = 0; j < answersArr[i].length; j++) {
            const answer = answersArr[i][j][0].trim(); // remove front and trailed space
            const cs = answersArr[i][j][2];
            const mid = answersArr[i][j][3];
            const sampleAnswer = this.mapModelIdToSampleAnswer[mid];
            if (cs !== "" && cs !== null) { // = answer box, ignore comment box
              totalNoOfAnswer++;
              // case sensitive checking
              if (cs && answer === sampleAnswer) {
                correctNoOfAnswer++;
              } else if (!cs && answer.toString().toUpperCase() === sampleAnswer.toString().toUpperCase()) {
                correctNoOfAnswer++;
              }
              // update submitted answers (number of attempt of each answer box)
              for (let k = 0; k < submittedAnswersArr.length; k++) {
                if (submittedAnswersArr[k][0] === mid) {
                  let foundExistingAnswer:boolean = false;
                  for (let l = 0; l < submittedAnswersArr[k][2].length; l++) {
                    const submittedAnswer = submittedAnswersArr[k][2][l];
                    if (cs && submittedAnswer === answer) {
                      foundExistingAnswer = true;
                      break;
                    } else if (!cs && answer.toString().toUpperCase() === submittedAnswer.toString().toUpperCase()) {
                      foundExistingAnswer = true;
                      break;
                    }
                  }
                  if (!foundExistingAnswer) {
                    console.log('not foundExistingAnswer');
                    submittedAnswersArr[k][1] += 1;
                    submittedAnswersArr[k][2].push(answer);
                  }
                }
              }
            }
          }
        }
        // --- submit answer & results & paper ---
        this.submitArr['markPercentageC'] = correctNoOfAnswer / totalNoOfAnswer;
        this.submitArr['correctC'] = correctNoOfAnswer;
        this.submitArr['wrongC'] = totalNoOfAnswer - correctNoOfAnswer;
        if (isFirstTime) {
          this.submitArr['markPercentageF'] = this.submitArr['markPercentageC'];
          this.submitArr['correctF'] = this.submitArr['correctC'];
          this.submitArr['wrongF'] = this.submitArr['wrongC'];
          this.submitArr['answersF'] = this.submitArr['answersC'];
        }
        this.submitArr['submittedAnswers'] = submittedAnswersArr;
        this.submitArr['numOfSubmission'] += 1;
        // thumbnail
        const imgData = this.canvas.toDataURL();
        this.submitArr['thumbnail'] = imgData;
        // submit
        const token = this.cs.localStorageItem('jwttoken');
        this.skyboardService.submitAnAnswer(token, this.submitArr).then((result) => {
          if (result['success']) {
            console.log('submission accepted');
            // change state and store return obj as an initial state of answer
            const jsonMsg = JSON.stringify(['change-stage-to-view', result['msg']]);
            this.onActivateProcess.emit(jsonMsg);
          } else {
            console.error(result['msg']);
          }
        }, (err) => {
          // show error
          console.error(err);
        });
      } else {
        this.showSubmitDiv = true;
      }
    }
  }
  onClickViewLinkButton = (): void => {
    console.log('onClickViewLinkButton');
    if (this.tempTextOfTextArea) {
      let url = "";
      if (!/^http[s]?:\/\//.test(this.tempTextOfTextArea)) {
        url += 'http://';
      }
      url += this.tempTextOfTextArea;
      window.open(url, "_blank");
    } else {
     console.error('no url found in onClickViewLinkButton');
    }
  }
  // ------------------------------
  // --- For Play Challenge -------
  // ------------------------------
  onClickPreviousPage = (): void => {
    // end skyapp board action
    this.removeDashedBordersForAllObjects();
    this.activateTool('refresh');
    this.activateTool('done');
    if (this.currentPageNumber >= 2) {
      this.savePageInPlayMode();
      this.currentPageNumber -= 1;
      this.loadPageInPlayMode();
    }
  }
  onClickNextPage = (): void => {
    // end skyapp board action
    this.removeDashedBordersForAllObjects();
    this.activateTool('refresh');
    this.activateTool('done');
    const numberOfPages = this.modelArr['numberOfPages'];
    const inputtedAllAnswers = this.checkInputtedAnswersForAllAnswersBoxesInThePage();
    if (inputtedAllAnswers && this.currentPageNumber < numberOfPages) {
      this.savePageInPlayMode();
      this.currentPageNumber += 1;
      this.loadPageInPlayMode();
    }
  }
  savePageInPlayMode = (): void => {
    // save invi boxes's answers
    this.savePlayerAnswerOfCurrentPage(this.submitArr);
    // save current page's array
    this.saveCurrentAnswersLayerstoPaper(this.submitArr);
  }
  loadPageInPlayMode = (): void => {
    // load new page's array
    this.loadPaperForOnePage(false, true, true);
    // activate play-layer
    this.currentActiveLayerNumber = 6;
    const jsonMsg2 = JSON.stringify(['activate-layer', this.LAYERS_NAME[this.currentActiveLayerNumber]]);
    this.onActivateProcess.emit(jsonMsg2);
  }
  loadPageInViewMode = (): void => {
    // load new page's array
    this.loadPaperForOnePage(false, true, true);
    // activate play-layer
    this.currentActiveLayerNumber = 10;
    const jsonMsg2 = JSON.stringify(['activate-layer-for-view', this.LAYERS_NAME[this.currentActiveLayerNumber]]);
    this.onActivateProcess.emit(jsonMsg2);
  }
  checkInputtedAnswersForAllAnswersBoxesInThePage = (): boolean => {
    for (let j = 0; j < this.scope.project.layers[6].children.length; j++) {
      const obj = this.scope.project.layers[6].children[j];
      if (obj.name === 'answer-box-group-from-teacher') {
        const jsonItem = this.getJSONItemFromControlItem(obj);
        if (jsonItem) {
          const json = JSON.parse(jsonItem.content);
          const answer = json[0];
          if (answer === null || answer === '') {
            console.log('obj - ' + obj.id + ' has no answer input');
            // change dashboard of this obj to red color
            for (let j = 0; j < obj.children.length; j++){
              if (obj.children[j].name === 'answer-box-from-teacher') {
                this.createColorDashedBorderOfBox(obj, 'blue');
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }
  // -------------------------------
  // --- For Play Challenge (End)---
  // -------------------------------
  callNewLayerFromStepButton = (newStepNumber: number): void => {
    // create-challenge only
    if (newStepNumber >= 0 && newStepNumber <= 5) {
      const jsonMsg = JSON.stringify(['activate-layer', this.LAYERS_NAME[newStepNumber]]);
      this.onActivateProcess.emit(jsonMsg);
    } else {
      console.error('callNewLayerFromStepButton error - with new step number of ' + newStepNumber);
    }
  }
  // call from parent
  activateLayer = (layerName: string): void => {
    if (this.scope) {
      const previousLayerNumber = this.currentActiveLayerNumber;
      for (let i = 0; i < this.scope.project.layers.length; i++) {
        if (layerName === this.LAYERS_NAME[i]) {
          this.currentActiveLayerNumber = i;
          break;
        }
      }
      this.removeAllControlsOfAnObject();
      this.activateTool('done');
      this.activateTool('transform');
      // update (Create-challenge)
      if (this.currentActiveLayerNumber >= 1 && this.currentActiveLayerNumber <= 4) {
        if (previousLayerNumber === 5) {
          // only load page again if the original layer is from 5, game option, which is saved.
          this.loadPaperForOnePage(true, true, false);
        }
        this.scope.project.layers[this.currentActiveLayerNumber].activate();
        // hide game options
        const jsonMsg = JSON.stringify(['hide-game-option']);
        this.onActivateProcess.emit(jsonMsg);
        this.clearNonDrawingLayers(this.currentActiveLayerNumber);
        this.showAllTools();
        this.showBoxToolDiv();
        this.showCanvas();
        this.showControlDiv();
      } else if (this.currentActiveLayerNumber === 5) {
        // For Paper 1.2, save current page's array first, dont save after changing box value to empty
        if (previousLayerNumber >= 1 && previousLayerNumber <= 4) {
          // save sample data array
          this.saveSampleAnswerOfCurrentPage(this.currentSampleAnswerArr);
          // hide answer from text item for thumbnail capturing and storing data without answer
          this.hideTextOfAllAnswerAndCommentBoxes();
          // save paper array
          this.saveCurrentChallengeLayerstoPaper();
        }
        // step 5 [wait 1 second for the screen to update first]
        setTimeout(() => {
          const jsonMsg = JSON.stringify(['show-game-option']);
          this.onActivateProcess.emit(jsonMsg);
          this.clearNonDrawingLayers(this.currentActiveLayerNumber);
        }, 200);
      } else if (this.currentActiveLayerNumber === 6) {
        // play-mode
        this.scope.project.layers[this.currentActiveLayerNumber].activate();
        this.clearNonDrawingLayers(this.currentActiveLayerNumber);
        this.showAllTools();
        this.hideBoxToolDiv();
        this.showCanvas();
        this.showControlDiv();
      } else if (this.currentActiveLayerNumber === 10) {
        // view-mode
        this.scope.project.layers[this.currentActiveLayerNumber].activate();
        this.clearNonDrawingLayers(this.currentActiveLayerNumber);
        this.hideAllTools();
        this.hideBoxToolDiv();
        this.showCanvas();
        this.hideControlDiv();
      }
    } else {
      console.error('activateLayer - scope does not exist');
    }

  }
  onChangeColor = (newColor: string): void => {
    this.color = newColor;
  }
  onChangeOnTextArea = (ev): void => {
    console.log('onChangeOnTextArea');
    try {
      if (this.controlItem) {
        if (this.controlItem.name === 'text') {
          const textItem = this.getTextItemFromControlItem(this.controlItem);
          if (textItem) {
            textItem.content = this.tempTextOfTextArea;
            this.removeAllControlsOfAnObject();
            this.oriRect = this.initOriRect(textItem);
            if (this.oriRect) {
              this.controllersGroup = this.initTransformController(this.oriRect);
              this.rotateController = this.initRotationController(this.oriRect);
            }
          } else {
            console.error('onChangeOnTextArea error - no textitem is found.');
          }
        } else if (this.controlItem.name === 'answer-box-group') {
          console.log('answer-box-group');
          this.boxUpdateJSONOnTextItem(1, this.controlItem);
        } else if (this.controlItem.name === 'comment-box-group') {
          this.boxUpdateJSONOnTextItem(2, this.controlItem);
          this.updateTextItemByNewTextInput(this.controlItem, this.tempTextOfTextArea, false);
        } else if (this.controlItem.name === 'link-box-group') {
          this.boxUpdateJSONOnTextItem(3, this.controlItem);
        }
      }
      // from teacher
      if (this.selectedBoxFromTeacher) {
        if (this.selectedBoxFromTeacher.name === 'answer-box-group-from-teacher') {
          console.log('answer-box-group-from-teacher');
          this.boxUpdateJSONOnTextItem(1, this.selectedBoxFromTeacher);
        } else if (this.selectedBoxFromTeacher.name === 'comment-box-group-from-teacher') {
          this.boxUpdateJSONOnTextItem(2, this.selectedBoxFromTeacher);
          this.updateTextItemByNewTextInput(this.selectedBoxFromTeacher, this.tempTextOfTextArea, false);
        }
      }
    } catch (e) {
      console.error('onChangeOnTextArea Error --> ');
      console.error(e);
    }
  }
  onChangeOnCaseSensitive = (ev): void => {
    try {
      if (this.controlItem) {
        if (this.controlItem.name === 'answer-box-group') {
          this.boxUpdateJSONOnTextItem(1, this.controlItem);
        }
      }
      // from teacher
      if (this.selectedBoxFromTeacher) {
        if (this.selectedBoxFromTeacher.name === 'answer-box-group-from-teacher') {
          this.boxUpdateJSONOnTextItem(1, this.selectedBoxFromTeacher);
        }
      }
    } catch (e) {
      console.error('onChangeOnCaseSensitive Error --> ');
      console.error(e);
    }
  }
  onChangeOfTextInput = (ev): void => {
    try {
      if (this.controlItem) {
        if (this.controlItem.name === 'link-box-group') {
          this.boxUpdateJSONOnTextItem(3, this.controlItem);
          this.updateTextItemByNewTextInput(this.controlItem, this.tempTextOfInput, false);
        } else if (this.controlItem.name === 'answer-box-group') {
          this.boxUpdateJSONOnTextItem(1, this.controlItem);
          this.updateTextItemByNewTextInput(this.controlItem, this.tempTextOfInput, false);
        }
      }
      // from teacher ****
      if (this.selectedBoxFromTeacher) {
        if (this.selectedBoxFromTeacher.name === 'answer-box-group-from-teacher') {
          this.boxUpdateJSONOnTextItem(1, this.selectedBoxFromTeacher);
          this.updateTextItemByNewTextInput(this.selectedBoxFromTeacher, this.tempTextOfInput, false); // *boolean wrong
        }
      }
    } catch (e) {
      console.error('onChangeOfTextInput Error --> ');
      console.error(e);
    }
  }
  // 0 = text, 1 = answer, 2 = comment, 3 = link
  boxUpdateJSONOnTextItem = (type: number, obj: any): void => {
    let val;
    if (type === 1) {
      // 0- answer, 1- comment, 2- case sensitive, 3- id
      val = [this.tempTextOfInput, this.tempTextOfTextArea, this.tempCaseSensitive, this.tempID];
    } else if (type === 2) {
      // 0- answer, 1- comment, 2- case sensitive, 3- id
      val = [null, this.tempTextOfTextArea, null, this.tempID];
    } else if (type === 3) {
      // 0- title, 1-url
      val = [this.tempTextOfInput, this.tempTextOfTextArea];
    }
    const json = JSON.stringify(val);
    const jsonItem = this.getJSONItemFromControlItem(obj);
    if (jsonItem) {
      jsonItem.content = json;
    }
  }
  updateTextItemByNewTextInput = (obj: any, text: string, hide: boolean): void => {
    // console.log('updateTextItemByNewTextInput');
    // console.log('obj.id = ' + obj.id);
    // console.log('text = ' + text);
    // 0-text, 1-answer, 2-comment, 3-link
    const typeName = obj.name;
    const showTextIfNoInput = [' ', '_', '_', 'url'];
    // cut too long text
    if (text) {
      if (text.length > 50) {
        text = text.substr(0, 50) + '...';
      }
    }
    for (let i = 0; i < this.CONTROL_ITEM_NAMES_FOR_EDIT.length; i++) {
      if (typeName === this.CONTROL_ITEM_NAMES_FOR_EDIT[i] || typeName === this.CONTROL_ITEM_NAMES_FOR_EDIT[i] + '-from-teacher') {
        let textItem;
        if (typeName === this.CONTROL_ITEM_NAMES_FOR_EDIT[i]) {
          textItem = this.getTextItemFromControlItem(obj);
        } else if (typeName === this.CONTROL_ITEM_NAMES_FOR_EDIT[i] + '-from-teacher') {
          textItem = this.getTextItemFromControlItem(this.mapInviBoxIdtoQuestionBox[obj.id]);
        }
        const oriBounds = obj.bounds; // This bound must be recorded before update textItem's content
        if (textItem) {
          if (hide) {
            // UI of no input = UI of hide
            textItem.content = showTextIfNoInput[i];
          } else {
            textItem.content = (text !== '') ? text : showTextIfNoInput[i];
          }
          this.resizeTextItemInsideBoxRect(textItem, oriBounds);
        }
        break;
      }
    }
  }
  getJSONItemFromControlItem = (ci: any): paper.PointText => {
    const boxGroup = <paper.Group> ci;
    let item;
    if (boxGroup && boxGroup.children) {
      for (let i = 0; i < boxGroup.children.length; i++) {
        if (boxGroup.children[i].name === 'answer-box-json'
          || boxGroup.children[i].name === 'comment-box-json'
          || boxGroup.children[i].name === 'link-box-json'
          || boxGroup.children[i].name === 'answer-box-json-from-teacher'
          || boxGroup.children[i].name === 'comment-box-json-from-teacher'
          || boxGroup.children[i].name === 'link-box-json-from-teacher'
        ) {
          item = <paper.PointText> boxGroup.children[i];
        }
      }
    }
    return item;
  }
  getTextItemFromControlItem = (ci: any): paper.PointText => {
    let textItem;
    if (ci.name === 'text') {
      textItem = <paper.PointText> ci;
    } else {
      const boxGroup = <paper.Group> ci;
      if (boxGroup && boxGroup.children) {
        for (let i = 0; i < boxGroup.children.length; i++) {
          if (
            boxGroup.children[i].name === 'link-text' ||
            boxGroup.children[i].name === 'answer-box-text' ||
            boxGroup.children[i].name === 'comment-box-text' ||
            boxGroup.children[i].name === 'answer-box-text-from-teacher' ||
            boxGroup.children[i].name === 'comment-box-text-from-teacher' ||
            boxGroup.children[i].name === 'link-box-text-from-teacher') {
            textItem = <paper.PointText> boxGroup.children[i];
          }
        }
      }
    }
    return textItem;
  }
  isDisabled = (name): boolean => {
    for (let i = 0; i < this.TOOLS_NAME.length; i++) {
      if (name === this.TOOLS_NAME[i]) {
        // one more checking for move and edit buttons
        let boolSelectedControlItem = true;
        if (i >= 15 && i <= 20) {
          if (this.controlItem == null) {
            boolSelectedControlItem = false;
          }
        }
        if (this.BOOL_ENABLE_BUTTON[this.currentActiveLayerNumber][i] === 1 && boolSelectedControlItem) {
          // enable
          if (this.btns[this.TOOLS_NAME.indexOf(name)]) {
            this.btns[this.TOOLS_NAME.indexOf(name)].parentElement.classList.remove('btn-disabled');
          }
          return false;
        } else {
          // disable
          if (this.btns[this.TOOLS_NAME.indexOf(name)]) {
            this.btns[this.TOOLS_NAME.indexOf(name)].parentElement.classList.add('btn-disabled');
          }
          return true;
        }
      }
    }
    return true;
  }
  transformationToolMouseDown = (event: paper.ToolEvent) => {
    const hitResult = this.scope.project.activeLayer.hitTest(event.point, this.hitOptions);
    if (hitResult == null) {
      // if hits background, 1) de-select item, 2) remove controllers
      this.controlItem = null;
      this.resetControlGridValues();
      this.selectedBoxFromTeacher = null;
      this.removeAllControlsOfAnObject();
      this.lastEventPoint = this.scope.view.projectToView(event.point);
    } else {
      const index = this.OBJECTS_LIST.indexOf(hitResult.item.name);
      console.log('transform obj ' + hitResult.item.id + ' ' + hitResult.item.name);
      // if hits somethings, find out what it is and prepare following actions for mouse drag
      if ((index >= 0 && index <= 10) || index === 12 || (index >= 32 && index <= 33) || index === 37 || index === 38) {
        // if hits the Item, 1) mark it, 2) remove controls and 3) init controllers
        if (index === 0 || index === 5 || index === 9 || index === 12 || (index >= 32 && index <= 33) || index === 37 || index === 38) {
          this.controlItem = hitResult.item.parent;
        } else {
          this.controlItem = hitResult.item;
        }
        // console.log('id = ' + this.controlItem.id);
        this.resetControlGridValues();
        this.selectedBoxFromTeacher = null;
        this.removeAllControlsOfAnObject();
        this.oriRect = this.initOriRect(this.controlItem);
        this.controllersGroup = this.initTransformController(this.oriRect);
        this.rotateController = this.initRotationController(this.oriRect);
        this.editBtn = this.initEditController(this.oriRect, this.controlItem.name);
      } else if (index >= 39 && index <= 50) {
        // click answer-box/comment-box/link-box from teacher
        this.isBoxClickByStudent = true;
        if ((index >= 39 && index <= 41) || (index >= 43 && index <= 45) || (index >= 47 && index <= 49)) {
          this.selectedBoxFromTeacher = hitResult.item.parent;
        } else {
          this.selectedBoxFromTeacher = hitResult.item;
        }
        // show input box (or dialog)
        this.resetControlGridValues();
        if (this.selectedBoxFromTeacher) {
          const jsonItem = this.getJSONItemFromControlItem(this.selectedBoxFromTeacher);
          if (jsonItem) {
            const json = JSON.parse(jsonItem.content);
            if (this.selectedBoxFromTeacher.name === 'answer-box-group-from-teacher') {
              if (this.currentActiveLayerNumber !== 10) {
                this.setPlaceholder(1);
                this.initAndOpenInputDivOfAnswerBox(1, json, this.selectedBoxFromTeacher.id);
              } else {
                // view-mode
                const mid = this.mapInviBoxIdtoModelId[this.selectedBoxFromTeacher.id];
                console.log('go to this answer box stat - ' + mid);
                document.getElementById('box'+mid).scrollIntoView();
                window.scrollBy(0, -60);
              }
            } else if (this.selectedBoxFromTeacher.name === 'comment-box-group-from-teacher') {
              if (this.currentActiveLayerNumber !== 10) {
                this.setPlaceholder(2);
                this.initAndOpenInputDivOfCommentBox(1, json, this.selectedBoxFromTeacher.id);
              } else {
                // view-mode
                const mid = this.mapInviBoxIdtoModelId[this.selectedBoxFromTeacher.id];
                console.log('go to this comment box stat - ' + mid);
                document.getElementById('box'+mid).scrollIntoView();
              }
            } else if (this.selectedBoxFromTeacher.name === 'link-box-group-from-teacher') {
              this.setPlaceholder(3);
              this.initAndOpenInputDivOfLinkBox(1, json);
            }
          } else {
            console.error('transformationToolMouseDown error - no jsonItem is found.');
          }
        } else {
          console.error('transformationToolMouseDown error - no selected box from teacher is found.');
        }
      } else {
        if (index >= 17 && index <= 25) {
          // scale - remove controllers, that cannot do other action until scaling end
          this.removeAllControlsOfAnObject();
          this.itemBound = new paper.Path.Rectangle(this.oriRect);
          this.initItemBound();
          // set ori length
          this.oriLength = Math.abs(event.point.x - this.itemBound.bounds.center.x) * 2;
        } else if (index >= 26 && index <= 27) {
          // rotate - remove controllers, that cannot do other action until end
          this.removeAllControlsOfAnObject();
          const newMaxLength = this.oriRect.height > this.oriRect.width ? this.oriRect.height : this.oriRect.width;
          this.itemBound = new paper.Path.Rectangle(new paper.Rectangle({
            x: this.oriRect.center.x - newMaxLength / 2,
            y: this.oriRect.center.y - newMaxLength / 2,
            width: newMaxLength,
            height: newMaxLength,
          }));
          this.initItemBound();
          // set ori rotation
          this.oriRotation = event.point.subtract(this.controlItem.bounds.center).angle + 90;
        } else if (index === 28) {
          // edit
          this.isEdit = true;
          // ... this part can be updated by indexOf ...
          for (let i = 0; i < this.CONTROL_ITEM_NAMES_FOR_EDIT.length; i++) {
            if (this.controlItem.name === this.CONTROL_ITEM_NAMES_FOR_EDIT[i]) {
              this.activateTool(this.ACTIVATE_TOOL_NAMES_FOR_EDIT[i]);
            }
          }
        }
      }
    }
  }
  transformationToolMouseDrag = (event: paper.ToolEvent) => {
    // move item with controllersGroup
    if (this.controlItem) {
      this.doScaleRotateOrMove(event);
    } else {
      // project background (screen's view) by - https://github.com/paperjs/paper.js/issues/525
      const point = this.scope.view.projectToView(event.point);
      const last = this.scope.view.viewToProject(this.lastEventPoint);
      const newX = this.scope.view.center.x + last.subtract(event.point).x;
      const newY = this.scope.view.center.y + last.subtract(event.point).y;
      if (this.boolAcceptViewCenter(new paper.Point({x: newX, y: newY}))) {
        this.scope.view.scrollBy(last.subtract(event.point));
      }
      this.lastEventPoint = point;
      this.boolTransformed = true;
    }
  }
  transformationToolMouseUp = (event: paper.ToolEvent) => {
    this.endTransformation(true);
  }
  endTransformation = (turnOnEditController: boolean): void => {
    if (this.controlItem != null && (this.oriLength != null || this.oriRotation != null || this.boolTransformed)) {
      // finish scaling/rotation/transformation, reload controllers
      this.removeAllControlsOfAnObject();
      this.createDashedBordersForAllObjectsInActiveLayer();
      // refresh all transformation controllers
      this.oriRect = this.initOriRect(this.controlItem);
      this.controllersGroup = this.initTransformController(this.oriRect);
      this.rotateController = this.initRotationController(this.oriRect);
      if (turnOnEditController) {
        this.editBtn = this.initEditController(this.oriRect, this.controlItem.name);
      }
    }
    // reset
    this.oriLength = null;
    this.oriRotation = null;
    this.boolTransformed = false;
    this.transformTouchedObjectChecked = false;
    this.transformTouchedObjectPass = false;

  }
  doScaleRotateOrMove = (event: paper.ToolEvent): void => {
    this.removeDashedBordersForAllObjects();
    if (this.oriLength != null) {
      // --- do scaling ---
      const newW = Math.abs(event.point.x - this.itemBound.bounds.center.x) * 2;
      const newScale = newW / this.oriLength;
      const newH = this.itemBound.bounds.height * ( newScale );
      if (newW > this.MIN_LENGTH_OF_SCALING_BOUND && newH > this.MIN_LENGTH_OF_SCALING_BOUND) {
        this.itemBound.scale(newScale);
        this.controlItem.fitBounds(this.itemBound.bounds);
        this.oriLength = newW;
      }
    } else if (this.oriRotation != null) {
      // --- do rotation ---
      const newRotation = event.point.subtract(this.controlItem.bounds.center).angle + 90 - this.oriRotation;
      this.controlItem.rotate(newRotation);
      this.oriRotation = event.point.subtract(this.controlItem.bounds.center).angle + 90;
    } else {
      // check whether the first drag touched the object
      if (!this.transformTouchedObjectChecked) {
        this.transformTouchedObjectPass = false;
        const hitResult = this.scope.project.activeLayer.hitTest(event.point, this.hitOptions);
        if (hitResult != null) {
          // console.log(index + '-' + hitResult.item.name);
          if (hitResult.item === this.controlItem || hitResult.item.parent === this.controlItem) {
            this.transformTouchedObjectPass = true;
          }
        }
        this.transformTouchedObjectChecked = true;
      }
      // --- do transformation ---
      // move item
      if (this.transformTouchedObjectPass) {
        const newX = this.controlItem.position.x + event.delta.x;
        const newY = this.controlItem.position.y + event.delta.y;
        // check existing boundary
        if (newX > 0 && newX < this.DEFAULT_BOARD_WIDTH && newY > 0 && newY < this.DEFAULT_BOARD_HEIGHT) {
          // remove controllers in first time transformation
          this.removeAllControlsOfAnObject();
          this.controlItem.position = new paper.Point(newX, newY);
          this.boolTransformed = true;
        }
      }
    }
  }
  zoomOutToolMouseDown = (event: paper.ToolEvent) => {
    const factor = this.ZOOM_FACTOR;
    if (this.scope.view.zoom * 1 / factor >= this.MIN_ZOOM) {
      this.scope.view.zoom *= 1 / factor;
    } else {
      this.scope.view.zoom = this.MIN_ZOOM;
    }
    if (this.boolAcceptViewCenter(event.point)) {
      this.scope.view.center = event.point;
    }
  }
  zoomInToolMouseDown = (event: paper.ToolEvent) => {
    const factor = this.ZOOM_FACTOR;
    if (this.scope.view.zoom * factor <= this.MAX_ZOOM) {
      this.scope.view.zoom *= factor;
    } else {
      this.scope.view.zoom = this.MAX_ZOOM;
    }
    if (this.boolAcceptViewCenter(event.point)) {
      this.scope.view.center = event.point;
    }
  }
  penToolMouseDown = (event: paper.ToolEvent) => {
    if (this.currentPathNumber < this.MAX_NUMBER_OF_PATHS_IN_A_GROUP) {
      this.tempPath = new paper.Path();
      this.tempPath.name = 'stroke-path';
      this.tempPath.add(event.point);
      this.tempPath.strokeColor = this.color;
    } else {
      // alert existed max value of paths in a group.
    }
  }
  penToolMouseDrag = (event: paper.ToolEvent) => {
    if (this.currentPathNumber < this.MAX_NUMBER_OF_PATHS_IN_A_GROUP && this.tempPath != null) {
      this.tempPath.add(event.point);
    }
  }
  penToolMouseUp = (event: paper.ToolEvent) => {
    if (this.currentPathNumber < this.MAX_NUMBER_OF_PATHS_IN_A_GROUP) {
      this.tempPath.simplify(10);
      this.tempPathArr[this.currentPathNumber++] = this.tempPath;
    }
  }
  circleToolMouseDown = (event: paper.ToolEvent) => {
    this.firstPoint = event.point;
  }
  circleToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    const secondPoint = event.point;
    const distance = this.calculateDistance(this.firstPoint, secondPoint);
    const trackingPath = new paper.Path.Line(this.firstPoint, secondPoint);
    trackingPath.strokeColor = 'red';
    const trackingCircle = new paper.Path.Circle(this.firstPoint, distance);
    trackingCircle.strokeColor = 'red';

    // remove tracking circle and path, and display another one while dragging
    trackingPath.add(event.point);
    trackingPath.removeOn({
      drag: true,
      down: true,
      up: true
    });
    trackingCircle.removeOn({
      drag: true,
      down: true,
      up: true
    });
  }
  circleToolMouseUp = (event: paper.ToolEvent) => {
    const secondPoint = event.point;
    const distance = this.calculateDistance(this.firstPoint, secondPoint);
    if (distance * 2 > this.MIN_LENGTH_OF_SCALING_BOUND) {
      const myCircle = new paper.Path.Circle(this.firstPoint, distance);
      myCircle.name = 'circle';
      myCircle.fillColor = this.color;
      this.activateTool('transform');
    } else {
      // --- warning ---
      // not allow circle too small
      // max number of circles
    }
  }
  calculateDistance = (firstPoint: paper.Point, secondPoint: paper.Point): number => {
    const x1 = firstPoint.x;
    const y1 = firstPoint.y;
    const x2 = secondPoint.x;
    const y2 = secondPoint.y;
    const distance = Math.sqrt((Math.pow((x2 - x1), 2)) + (Math.pow((y2 - y1), 2)));
    return distance;
  }
  squareToolMouseDown = (event: paper.ToolEvent) => {
    this.firstPoint = event.point;
  }
  squareToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    const secondPoint = event.point;
    const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
    const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
    const trackingPath = new paper.Path.Line(this.firstPoint, secondPoint);
    trackingPath.strokeColor = 'red';
    const trackingRect = new paper.Path.Rectangle(
      new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
      new paper.Size(width, height)
    );
    trackingRect.strokeColor = 'red';

    // remove tracking rect and path, and display another one while dragging
    trackingPath.add(event.point);
    trackingPath.removeOn({
      drag: true,
      down: true,
      up: true
    });
    trackingRect.removeOn({
      drag: true,
      down: true,
      up: true
    });
  }
  squareToolMouseUp = (event: paper.ToolEvent) => {
    const secondPoint = event.point;
    const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
    const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
    if (width > this.MIN_LENGTH_OF_SCALING_BOUND && height > this.MIN_LENGTH_OF_SCALING_BOUND) {
      const rect = new paper.Path.Rectangle(
        new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
        new paper.Size(width, height)
      );
      rect.name = 'rectangle';
      rect.fillColor = this.color;
      this.activateTool('transform');
    } else {
      // --- warning ---
      // not allow rec too small
      // max number of rect
    }
  }
  normalLineToolMouseDown = (event: paper.ToolEvent) => {
    this.firstPoint = event.point;
  }
  normalLineToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    const secondPoint = event.point;
    const trackingPath = new paper.Path.Line(this.firstPoint, secondPoint);
    trackingPath.strokeColor = this.color;
    // remove tracking rect and path, and display another one while dragging
    trackingPath.add(event.point);
    trackingPath.removeOn({
      drag: true,
      down: true,
      up: true
    });
  }
  normalLineToolMouseUp = (event: paper.ToolEvent) => {
    const secondPoint = event.point;
    const distance = this.calculateDistance(this.firstPoint, secondPoint);
    if (distance * 2 > this.MIN_LENGTH_OF_SCALING_BOUND) {
      const line = new paper.Path.Line(this.firstPoint, secondPoint);
      line.name = 'line';
      line.strokeColor = this.color;
      this.activateTool('transform');
    } else {
      // --- warning ---
      // not allow line too small
      // max number of line
    }
  }
  arrowLineToolMouseDown = (event: paper.ToolEvent) => {
    this.firstPoint = event.point;
  }
  arrowLineToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    const secondPoint = event.point;
    const trackingPath = new paper.Path.Line(this.firstPoint, secondPoint);
    trackingPath.strokeColor = this.color;
    const v1 = secondPoint.subtract(this.firstPoint);
    v1.length *= 0.95;
    v1.angle += 2;
    const v2 = secondPoint.subtract(this.firstPoint);
    v2.length *= 0.95;
    v2.angle -= 2;
    const trackingPath1 = new paper.Path.Line(this.firstPoint.add(v1), secondPoint);
    const trackingPath2 = new paper.Path.Line(this.firstPoint.add(v2), secondPoint);
    trackingPath1.strokeColor = this.color;
    trackingPath2.strokeColor = this.color;
    // remove tracking rect and path, and display another one while dragging
    trackingPath.add(event.point);
    trackingPath.removeOn({
      drag: true,
      down: true,
      up: true
    });
    trackingPath1.removeOn({
      drag: true,
      down: true,
      up: true
    });
    trackingPath2.removeOn({
      drag: true,
      down: true,
      up: true
    });
  }
  arrowLineToolMouseUp = (event: paper.ToolEvent) => {
    const secondPoint = event.point;
    const distance = this.calculateDistance(this.firstPoint, secondPoint);
    if (distance * 2 > this.MIN_LENGTH_OF_SCALING_BOUND) {
      const line = new paper.Path.Line(this.firstPoint, secondPoint);
      const vector1 = secondPoint.subtract(this.firstPoint);
      vector1.length *= 0.95;
      vector1.angle += 2;
      const vector2 = secondPoint.subtract(this.firstPoint);
      vector2.length *= 0.95;
      vector2.angle -= 2;
      const line1 = new paper.Path.Line(this.firstPoint.add(vector1), secondPoint);
      const line2 = new paper.Path.Line(this.firstPoint.add(vector2), secondPoint);
      line.strokeColor = this.color;
      line1.strokeColor = this.color;
      line2.strokeColor = this.color;
      line.name = 'arrow-line-component';
      line1.name = 'arrow-line-component';
      line2.name = 'arrow-line-component';
      // put them into group
      this.tempGroup = new paper.Group();
      this.tempGroup.addChild(line);
      this.tempGroup.addChild(line1);
      this.tempGroup.addChild(line2);
      this.tempGroup.name = 'arrow-line-group';
      this.scope.project.layers[this.currentActiveLayerNumber].addChild(this.tempGroup);
      this.activateTool('transform');
    } else {
      // --- warning ---
      // not allow line too small
      // max number of line
    }
  }
  textToolMouseDown = (event: paper.ToolEvent) => {
    this.boxToolMouseDown(event, 0);
  }
  textToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    if (!this.boolCreatedBox) {
      //
    } else {
      // move item with controllersGroup
      if (this.controlItem) {
        this.doScaleRotateOrMove(event);
      }
    }
  }
  textToolMouseUp = (event: paper.ToolEvent) => {
    if (!this.boolCreatedBox) {
      // 1st hit locates text
      const textItem = new paper.PointText(event.point);
      textItem.name = 'text';
      textItem.fontSize = this.DEFAULT_FONT_SIZE;
      textItem.fillColor = this.color;
      textItem.position = event.point;
      textItem.content = this.tempTextOfTextArea;
      this.scope.project.layers[this.scope.project.layers.length - 1].addChild(textItem);
      // transformation usage
      this.removeAllControlsOfAnObject();
      this.controlItem = textItem;
      this.oriRect = this.initOriRect(textItem);
      this.controllersGroup = this.initTransformController(this.oriRect);
      this.rotateController = this.initRotationController(this.oriRect);
      // for this tool condition
      this.boolCreatedBox = true;
      // open control grid
      this.setPlaceholder(0);
      this.showTextAreaDiv = true;
      this.showDialogOfControlGrid();
    } else {
      this.endTransformation(false);
    }
  }
  fileSelectionToolMouseDown = (event: paper.ToolEvent) => {
    this.firstPoint = event.point;
    if (this.myTempFileData) {
      this.trackingRaster = new paper.Raster(this.myTempFileData);
      this.trackingRaster.name = 'picture';
      this.trackingRaster.position = new paper.Point(-50000, -50000);
    } else {
      console.error('fileSelectionToolMouseDown error - file is still uploading or no temp file data is found');
    }
  }
  fileSelectionToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    if (this.trackingRaster) {
      const secondPoint = event.point;
      const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
      const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
      const trackingRect = new paper.Path.Rectangle(
        new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
        new paper.Size(width, height)
      );
      if (width > this.MIN_LENGTH_OF_SCALING_BOUND && height > this.MIN_LENGTH_OF_SCALING_BOUND) {
        this.trackingRaster.opacity = 0.5;
        this.trackingRaster.position = new paper.Point(this.firstPoint.x, this.firstPoint.y);
        this.trackingRaster.fitBounds(trackingRect.bounds);
      }
      trackingRect.removeOn({
        drag: true,
        down: true,
        up: true
      });
    }
  }
  fileSelectionToolMouseUp = (event: paper.ToolEvent) => {
    if (this.trackingRaster) {
      if (this.trackingRaster.position.x > 0 && this.trackingRaster.position.y > 0) {
        this.trackingRaster.opacity = 1;
        this.activateTool('transform');
      } else {
        this.trackingRaster.remove();
      }
      this.trackingRaster = null;
    }
  }
  boxToolMouseDown = (event: paper.ToolEvent, fromType: number) => {
    if (!this.boolCreatedBox) {
      this.firstPoint = event.point;
    } else {
      const hitResult = this.scope.project.activeLayer.hitTest(event.point, this.hitOptions);
      if (hitResult == null) {
        // if hits background
      } else {
        const index = this.OBJECTS_LIST.indexOf(hitResult.item.name);
        console.log(index + '-' + hitResult.item.name);
        // if hits somethings, find out what it is and prepare corresponding action for mouse drag
        if (hitResult.item === this.controlItem) {
          // hit current object
          this.removeAllControlsOfAnObject();
          this.oriRect = this.initOriRect(this.controlItem);
          this.controllersGroup = this.initTransformController(this.oriRect);
          this.rotateController = this.initRotationController(this.oriRect);
        } else {
          // hit controllers
          if (index >= 17 && index <= 25) {
            // scale - remove controllers, that cannot do other action until scaling end
            this.removeAllControlsOfAnObject();
            this.itemBound = new paper.Path.Rectangle(this.oriRect);
            this.initItemBound();
            // set ori length
            this.oriLength = Math.abs(event.point.x - this.itemBound.bounds.center.x) * 2;
          } else if (index >= 26 && index <= 27) {
            // rotate - remove controllers, that cannot do other action until end
            this.removeAllControlsOfAnObject();
            const newMaxLength = this.oriRect.height > this.oriRect.width ? this.oriRect.height : this.oriRect.width;
            this.itemBound = new paper.Path.Rectangle(new paper.Rectangle({
              x: this.oriRect.center.x - newMaxLength / 2,
              y: this.oriRect.center.y - newMaxLength / 2,
              width: newMaxLength,
              height: newMaxLength,
            }));
            this.initItemBound();
            // set ori rotation
            this.oriRotation = event.point.subtract(this.controlItem.bounds.center).angle + 90;
          } else {
            // hits others = hit background
          }
        }
      }
    }
  }
  answerBoxToolMouseDown = (event: paper.ToolEvent) => {
    this.boxToolMouseDown(event, 1);
  }
  // fromType {0 = text, 1 = answer, 2 = comment, 3 = link}
  answerBoxToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    if (!this.boolCreatedBox) {
      const secondPoint = event.point;
      const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
      const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
      // create temp answer box
      let trackingRect = new paper.Path.Rectangle(
        new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
        new paper.Size(width, height)
      );
      trackingRect = this.roundPath(trackingRect, this.ROUND_ANSWER_BOX_RADIUS);
      trackingRect.opacity = 0.5;
      trackingRect.fillColor = 'white';
      trackingRect.strokeColor = 'black';
      trackingRect.removeOn({
        drag: true,
        down: true,
        up: true
      });
    } else {
      // move item with controllersGroup
      if (this.controlItem) {
        this.doScaleRotateOrMove(event);
      }
    }
  }
  answerBoxToolMouseUp = (event: paper.ToolEvent) => {
    if (!this.boolCreatedBox) {
      const secondPoint = event.point;
      const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
      const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
      if (width > this.MIN_LENGTH_OF_SCALING_BOUND && height > this.MIN_LENGTH_OF_SCALING_BOUND) {
        // answer box
        const eRect = new paper.Rectangle(
          new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
          new paper.Size(width, height)
        );
        let trackingRect = new paper.Path.Rectangle(eRect);
        trackingRect = this.roundPath(trackingRect, this.ROUND_ANSWER_BOX_RADIUS);
        trackingRect.name = 'answer-box';
        trackingRect.fillColor = 'white';
        trackingRect.strokeColor = 'black';
        // json item
        const textJSONItem = new paper.PointText(event.point);
        textJSONItem.name = 'answer-box-json';
        textJSONItem.position = new paper.Point(this.firstPoint.x, this.firstPoint.y);
        textJSONItem.visible = false;
        // text item
        const textItem = new paper.PointText(event.point);
        textItem.name = 'answer-box-text';
        textItem.fontSize = this.DEFAULT_FONT_SIZE;
        textItem.fillColor = 'black';
        textItem.content = (this.tempTextOfInput !== '') ? this.tempTextOfInput : '_';
        textItem.position = this.firstPoint;
        this.resizeTextItemInsideBoxRect(textItem, eRect);
        // answer box group
        this.tempGroup = new paper.Group();
        this.tempGroup.addChild(trackingRect);
        this.tempGroup.addChild(textJSONItem);
        this.tempGroup.addChild(textItem);
        this.tempGroup.name = 'answer-box-group';
        this.scope.project.layers[this.scope.project.layers.length - 1].addChild(this.tempGroup);
        // transformation usage
        this.removeAllControlsOfAnObject();
        this.controlItem = this.tempGroup;
        this.oriRect = this.initOriRect(this.controlItem);
        this.controllersGroup = this.initTransformController(this.oriRect);
        this.rotateController = this.initRotationController(this.oriRect);
        // init text item json value
        this.tempTextOfInput = '';
        this.tempTextOfTextArea = '';
        this.tempCaseSensitive = false;
        this.tempID = this.tempGroup.id;
        const val = [this.tempTextOfInput, this.tempTextOfTextArea, this.tempCaseSensitive, this.tempID];
        const json = JSON.stringify(val);
        textJSONItem.content = json;
        // for this tool condition
        this.boolCreatedBox = true;
        // show control grid
        this.setPlaceholder(1);
        this.showTextInputBoxDiv = true;
        this.showCaseSensitiveDiv = true;
        this.showTextAreaDiv = true;
        this.showDialogOfControlGrid();
      } else {
        // --- warning ---
        // not allow rec too small
        // max number of rect
      }
    } else {
      this.endTransformation(false);
    }
  }
  commentBoxToolMouseDown = (event: paper.ToolEvent) => {
    this.boxToolMouseDown(event, 2);
  }
  commentBoxToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    if (!this.boolCreatedBox) {
      const secondPoint = event.point;
      const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
      const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
      // create temp comment box
      const trackingRect = new paper.Rectangle(
        new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
        new paper.Size(width, height)
      );
      const trackingCommentBox = this.createCommentBoxPath(trackingRect);
      trackingCommentBox.opacity = 0.5;
      trackingCommentBox.removeOn({
        drag: true,
        down: true,
        up: true
      });
    } else {
      // move item with controllersGroup
      if (this.controlItem) {
        this.doScaleRotateOrMove(event);
      }
    }
  }
  commentBoxToolMouseUp = (event: paper.ToolEvent) => {
    if (!this.boolCreatedBox) {
      const secondPoint = event.point;
      const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
      const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
      if (width > this.MIN_LENGTH_OF_SCALING_BOUND && height > this.MIN_LENGTH_OF_SCALING_BOUND) {
        // comment box
        const eRect = new paper.Rectangle(
          new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
          new paper.Size(width, height)
        );
        const commentBox = this.createCommentBoxPath(eRect);
        commentBox.name = 'comment-box';
        // json item
        const textJSONItem = new paper.PointText(event.point);
        textJSONItem.name = 'comment-box-json';
        textJSONItem.position = new paper.Point(this.firstPoint.x, this.firstPoint.y);
        textJSONItem.visible = false;
        // text item
        const textItem = new paper.PointText(event.point);
        textItem.name = 'comment-box-text';
        textItem.fontSize = this.DEFAULT_FONT_SIZE;
        textItem.fillColor = 'black';
        textItem.content = (this.tempTextOfTextArea !== '') ? this.tempTextOfTextArea : '_';
        textItem.position = this.firstPoint;
        // answer box group
        this.tempGroup = new paper.Group();
        this.tempGroup.addChild(commentBox);
        this.tempGroup.addChild(textJSONItem);
        this.tempGroup.addChild(textItem);
        this.tempGroup.name = 'comment-box-group';
        this.scope.project.layers[this.scope.project.layers.length - 1].addChild(this.tempGroup);
        // transformation usage
        this.removeAllControlsOfAnObject();
        this.controlItem = this.tempGroup;
        this.oriRect = this.initOriRect(this.controlItem);
        this.controllersGroup = this.initTransformController(this.oriRect);
        this.rotateController = this.initRotationController(this.oriRect);
        // init text item json value
        this.tempTextOfTextArea = '';
        this.tempID = this.tempGroup.id;
        const val = [null, this.tempTextOfTextArea, null, this.tempID];
        const json = JSON.stringify(val);
        textJSONItem.content = json;
        // for this tool condition
        this.boolCreatedBox = true;
        this.setPlaceholder(2);
        this.showTextAreaDiv = true;
        this.showDialogOfControlGrid();
      } else {
        // --- warning ---
        // not allow rec too small
        // max number of rect
      }
    } else {
      this.endTransformation(false);
    }
  }
  linkToolMouseDown = (event: paper.ToolEvent) => {
    this.boxToolMouseDown(event, 3);
  }
  linkToolMouseDrag = (event: paper.ToolEvent) => {
    // get the point on mouse up and calculate the distance with 1st point
    if (!this.boolCreatedBox) {
      const secondPoint = event.point;
      const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
      const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
      // create temp comment box
      const trackingRect = new paper.Rectangle(
        new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
        new paper.Size(width, height)
      );
      const trackingBox = this.createLinkBoxPath(trackingRect);
      trackingBox.opacity = 0.5;
      trackingBox.removeOn({
        drag: true,
        down: true,
        up: true
      });
    } else {
      // move item with controllersGroup
      if (this.controlItem) {
        this.doScaleRotateOrMove(event);
      }
    }
  }
  linkToolMouseUp = (event: paper.ToolEvent) => {
    if (!this.boolCreatedBox) {
      const secondPoint = event.point;
      const width = Math.abs(this.firstPoint.x - secondPoint.x) * 2;
      const height = Math.abs(this.firstPoint.y - secondPoint.y) * 2;
      if (width > this.MIN_LENGTH_OF_SCALING_BOUND && height > this.MIN_LENGTH_OF_SCALING_BOUND) {
        // comment box
        const eRect = new paper.Rectangle(
          new paper.Point(this.firstPoint.x - width / 2, this.firstPoint.y - height / 2),
          new paper.Size(width, height)
        );
        const box = this.createLinkBoxPath(eRect);
        box.name = 'link-box';
        // text item
        const textItem = new paper.PointText(event.point);
        textItem.name = 'link-text';
        textItem.fontSize = this.DEFAULT_FONT_SIZE;
        textItem.fillColor = 'black';
        textItem.content = (this.tempTextOfInput !== '') ? this.tempTextOfInput : 'url';
        textItem.position = this.firstPoint;
        this.resizeTextItemInsideBoxRect(textItem, eRect);
        // json item
        const textJSONItem = new paper.PointText(event.point);
        textJSONItem.name = 'link-box-json';
        textJSONItem.position = this.firstPoint;
        textJSONItem.visible = false;
        // answer box group
        this.tempGroup = new paper.Group();
        this.tempGroup.addChild(box);
        this.tempGroup.addChild(textItem);
        this.tempGroup.addChild(textJSONItem);
        this.tempGroup.name = 'link-box-group';
        this.scope.project.layers[this.scope.project.layers.length - 1].addChild(this.tempGroup);
        // transformation usage
        this.removeAllControlsOfAnObject();
        this.controlItem = this.tempGroup;
        this.oriRect = this.initOriRect(this.controlItem);
        this.controllersGroup = this.initTransformController(this.oriRect);
        this.rotateController = this.initRotationController(this.oriRect);
        // init text item json value
        this.tempTextOfInput = '';
        this.tempTextOfTextArea = '';
        const val = [this.tempTextOfInput, this.tempTextOfTextArea];
        const json = JSON.stringify(val);
        textJSONItem.content = json;
        // for this tool condition
        this.boolCreatedBox = true;
        // show control grid
        this.setPlaceholder(3);
        this.showTextInputBoxDiv = true;
        this.showTextAreaDiv = true;
        this.showDialogOfControlGrid();
      } else {
        // --- warning ---
        // not allow rec too small
        // max number of rect
      }
    } else {
      this.endTransformation(false);
    }
  }
  resizeTextItemInsideBoxRect = (textItem: paper.PointText, rect: paper.Rectangle): void => {
    const heightScale = 0.95;
    const widthScale = 0.6;
    const fitBoundRect = new paper.Rectangle(
      new paper.Point(rect.center.x - rect.width * widthScale / 2, rect.center.y - rect.height * heightScale / 2),
      new paper.Size(rect.width * widthScale, rect.height * heightScale)
    );
    textItem.fitBounds(fitBoundRect);
    // console.log(textItem.content);
    // console.log(textItem.bounds);
  }
  activateTool = (name): void => {
    // console.log('activateTool name = ' + name);
    // Find New Button Number, update UI (yellow highlight)
    let newOnClickToolNumber = -1;
    for (let i = 0; i < this.TOOLS_NAME.length; i++) {
      if (name === this.TOOLS_NAME[i]) {
        newOnClickToolNumber = i;
        if (this.btns[i]) {
          this.btns[i].parentElement.classList.add('selectedTool');
        }
      } else {
        if (this.btns[i]) {
          this.btns[i].parentElement.classList.remove('selectedTool');
        }
      }
    }
    if (this.currentToolNumber === newOnClickToolNumber) {
      return;
    }
    // --------------------------------------------
    // ----------- On Active Tool (End) -----------
    // --------------------------------------------
    // End Transformation - Remove All Non-transformation controls
    if (this.currentToolNumber === 1 && newOnClickToolNumber !== 1) {
      this.removeDashedBordersForAllObjects();
      // if calling move or clone functions, or from edit
      if (
        newOnClickToolNumber === 15 || newOnClickToolNumber === 16 || newOnClickToolNumber === 17 ||
        newOnClickToolNumber === 18 || newOnClickToolNumber === 19 || this.isEdit) {
        if (this.isEdit) {
          console.log('activate tool with is edit');
          // from answer box or comment box
          if (this.controlItem) {
            this.boolCreatedBox = true; // this is for avoid creating a new box.
            if (this.controlItem.name === 'text') {
              this.setPlaceholder(0);
              // init value for control grid
              const textItem = this.getTextItemFromControlItem(this.controlItem);
              if (textItem) {
                this.initAndOpenInputDivOfTextBox(textItem);
              } else {
                console.error('activateTool isEdit error - text item not exists');
              }
            } else if (this.controlItem.name === 'answer-box-group') {
              this.setPlaceholder(1);
              const jsonItem = this.getJSONItemFromControlItem(this.controlItem);
              if (jsonItem) {
                const json = JSON.parse(jsonItem.content);
                this.initAndOpenInputDivOfAnswerBox(0, json, this.controlItem.id);
              } else {
                console.error('activateTool isEdit error - no jsonItem is found.');
              }
            } else if (this.controlItem.name === 'comment-box-group') {
              this.setPlaceholder(2);
              const jsonItem = this.getJSONItemFromControlItem(this.controlItem);
              if (jsonItem) {
                const json = JSON.parse(jsonItem.content);
                this.initAndOpenInputDivOfCommentBox(0, json, this.controlItem.id);
              } else {
                console.error('activateTool isEdit error - no jsonItem is found.');
              }
            } else if (this.controlItem.name === 'link-box-group') {
              this.setPlaceholder(3);
              const jsonItem = this.getJSONItemFromControlItem(this.controlItem);
              if (jsonItem) {
                const json = JSON.parse(jsonItem.content);
                this.initAndOpenInputDivOfLinkBox(0, json);
              } else {
                console.error('activateTool isEdit error - no jsonItem is found.');
              }
            }
          }
          this.isEdit = false;
        }
      } else {
        this.removeAllControlsOfAnObject();
      }
    }
    // End Pen, Circle, Square, Normal Line, Arrow Line, Text, Image, Answer, Comment, Link
    if (
      (this.currentToolNumber === 5 && newOnClickToolNumber !== 5) ||
      (this.currentToolNumber === 6 && newOnClickToolNumber !== 6) ||
      (this.currentToolNumber === 7 && newOnClickToolNumber !== 7) ||
      (this.currentToolNumber === 9 && newOnClickToolNumber !== 9) ||
      (this.currentToolNumber === 10 && newOnClickToolNumber !== 10) ||
      (this.currentToolNumber === 11 && newOnClickToolNumber !== 11) ||
      (this.currentToolNumber === 12 && newOnClickToolNumber !== 12) ||
      (this.currentToolNumber === 13 && newOnClickToolNumber !== 13) ||
      (this.currentToolNumber === 14 && newOnClickToolNumber !== 14) ||
      (this.currentToolNumber === 21 && newOnClickToolNumber !== 21)
    ) {
      // for tool condition and context menu
      this.boolCreatedBox = false;
      // make sure remove controls and borders before move objects to active layers
      this.resetControlGridValues();
      this.removeAllControlsOfAnObject();
      this.removeDashedBorderForTempLayer();
      this.moveObjectsFromTempLayerToActiveLayer();
      this.clearNonDrawingLayers(this.currentActiveLayerNumber);
      // activate active layer
      if (this.currentActiveLayerNumber) {
        this.scope.project.layers[this.currentActiveLayerNumber].activate(); // need?
      } else {
        console.error('activateTool error - no active layer number found');
      }
    }
    // ----------------------------------------------
    // ----------- On Active Tool (Init) ------------
    // ----------------------------------------------
    // Transformation tool
    if (this.currentToolNumber !== 1 && newOnClickToolNumber === 1) {
      // add dashed border all objects on active layers
      console.log('init trans tool dashed border here');
      this.createDashedBordersForAllObjectsInActiveLayer();
    }
    // Pen tool
    if (this.currentToolNumber !== 5 && newOnClickToolNumber === 5) {
      // start drawing
      this.tempPath = null;
      for (let i = 0; i < this.MAX_NUMBER_OF_PATHS_IN_A_GROUP; i++) {
        this.tempPathArr[i] = null;
      }
      this.currentPathNumber = 0;
      this.scope.project.layers[this.scope.project.layers.length - 1].activate();
      this.createDashedBorderForTempLayer();
      this.hazyNonTempLayers();
      this.showDoneDiv = true;
    }
    // Circle, Square, Normal Line, Arrow Line, *Text Tool, Answer & Comment Box
    if (
      (this.currentToolNumber !== 6 && newOnClickToolNumber === 6) ||
      (this.currentToolNumber !== 7 && newOnClickToolNumber === 7) ||
      (this.currentToolNumber !== 9 && newOnClickToolNumber === 9) ||
      (this.currentToolNumber !== 10 && newOnClickToolNumber === 10) ||
      (this.currentToolNumber !== 11 && newOnClickToolNumber === 11) ||
      (this.currentToolNumber !== 12 && newOnClickToolNumber === 12) ||
      (this.currentToolNumber !== 13 && newOnClickToolNumber === 13) ||
      (this.currentToolNumber !== 14 && newOnClickToolNumber === 14) ||
      (this.currentToolNumber !== 21 && newOnClickToolNumber === 21)
    ) {
      this.scope.project.layers[this.scope.project.layers.length - 1].activate();
      this.createDashedBorderForTempLayer();
      this.hazyNonTempLayers();
      this.showDoneDiv = true;
    }
    // ----------------------------------------------
    // -------------- Activate Tool -----------------
    // ----------------------------------------------
    this.currentToolNumber = newOnClickToolNumber;
    this.tools[newOnClickToolNumber].activate();

    // ----------------------------------------------
    // ---------- Tool's Button UI Update -----------
    // ----------------------------------------------
    if (this.btns[newOnClickToolNumber]) {
      this.btns[newOnClickToolNumber].parentElement.classList.add('selectedTool');
    }

    // --------------------------------------------
    // ----------- One Click Button ---------------
    // --------------------------------------------
    // Refresh Screen
    if (newOnClickToolNumber === 4) {
      console.log('do refresh screen');
      this.resizeCanvas(null);
      this.activateTool('nothing');
      return;
    }
    // Done Button
    if (newOnClickToolNumber === 8) {
      // on active tool's end process has been done above
      this.controlItem = null;
      this.resetControlGridValues();
      this.removeAllControlsOfAnObject();
      this.activateTool('transform');
      return;
    }
    // Move objects
    if (newOnClickToolNumber >= 15 && newOnClickToolNumber <= 18) {
      // --- locate this object in this layer
      // there is a mask, which is Path, always at the bottom [0]
      // there are two groups, which are controllers, always at the top [length - 1, length - 2]
      let objectNumber = -1;
      if (this.controlItem) {
        const length = this.scope.project.layers[this.currentActiveLayerNumber].children.length;
        for (let i = 0; i < length; i++) {
          if (this.controlItem === this.scope.project.layers[this.currentActiveLayerNumber].children[i]) {
            objectNumber = i;
          }
        }
        // Move Top
        if (newOnClickToolNumber === 15) {
          if (objectNumber < length - 4) {
            this.controlItem.moveBelow(this.scope.project.layers[this.currentActiveLayerNumber].children[length - 2]);
          }
        }
        // Move Up
        if (newOnClickToolNumber === 16) {
          if (objectNumber < length - 4) {
            this.controlItem.moveAbove(this.scope.project.layers[this.currentActiveLayerNumber].children[objectNumber + 1]);
          }
        }
        // Move Down
        if (newOnClickToolNumber === 17) {
          if (objectNumber >= 2) {
            this.controlItem.moveBelow(this.scope.project.layers[this.currentActiveLayerNumber].children[objectNumber - 1]);
          }
        }
        // Move Bottom
        if (newOnClickToolNumber === 18) {
          if (objectNumber >= 2) {
            this.controlItem.moveAbove(this.scope.project.layers[this.currentActiveLayerNumber].children[0]);
          }
        }
      } else {
        console.error('activateTool error - move object but no control item found');
      }
      this.activateTool('transform');
      return;
    }
    // Clone
    if (newOnClickToolNumber === 19) {
      console.log('do clone');
      if (this.controlItem) {
        const newObj = this.controlItem.clone();
        newObj.moveAbove(this.controlItem);
        const newX = this.controlItem.position.x + this.controlItem.bounds.width / 2 + 10 > this.DEFAULT_BOARD_WIDTH ?
          0 + this.controlItem.bounds.width / 2 : this.controlItem.position.x + 10;
        const newY = this.controlItem.position.y + this.controlItem.bounds.height / 2 + 10 > this.DEFAULT_BOARD_HEIGHT ?
          0 + this.controlItem.bounds.height / 2 : this.controlItem.position.y + 10;
        newObj.position = new paper.Point(newX, newY);
        // change name, by default, paperJS add number after name. But, we just copy name from the original object here
        this.copyNameFromOldObjToNewObj(this.controlItem, newObj, '');
        // target clone object
        this.removeAllControlsOfAnObject();
        this.controlItem = newObj;
      } else {
        console.error('activateTool error - clone object is clicked but no control item found');
      }
      this.activateTool('transform');
      // below functions must be done after activate the tool of transform due to dashed borders creation
      this.oriRect = this.initOriRect(this.controlItem);
      this.controllersGroup = this.initTransformController(this.oriRect);
      this.rotateController = this.initRotationController(this.oriRect);
      this.editBtn = this.initEditController(this.oriRect, this.controlItem.name);
      return;
    }
    // Remove
    if (newOnClickToolNumber === 20) {
      if (this.controlItem) {
        this.controlItem.remove();
        this.controlItem = null;
        this.removeAllControlsOfAnObject();
      } else {
        console.error('activateTool error - Remove object is clicked but no control item found');
      }
      this.activateTool('transform');
      return;
    }
  }
  initAndOpenInputDivOfTextBox = (textItem: any): void => {
    this.tempTextOfTextArea = textItem.content;
    this.showTextAreaDiv = true;
    this.showDialogOfControlGrid();
  }
  initAndOpenInputDivOfAnswerBox = (type: number, json: any, objID: number): void => {
    // type: {0 = from control item, 1 = from selected box from teacher}
    this.tempTextOfInput = (json[0] !== null) ? json[0] : ''; // answer
    this.tempTextOfTextArea = (json[1] !== null) ? json[1] : ''; // comment
    this.tempCaseSensitive = (json[2] !== null) ? json[2] : false;
    this.tempID = (json[3] !== null) ? json[3] : objID;
    this.showTextInputBoxDiv = true;
    this.showCaseSensitiveDiv = true;
    this.showTextAreaDiv = true;
    this.textInputFormControl.enable();
    this.disableCaseSensitive = (type === 1) ? true : false;
    this.textAreaFormControl.enable();
    this.showDialogOfControlGrid();
  }
  initAndOpenInputDivOfCommentBox = (type: number, json: any, objID: number): void => {
    // skipped 0 and 2
    this.tempTextOfTextArea = (json[1] !== null) ? json[1] : ''; // comment
    this.tempID = (json[3] !== null) ? json[3] : this.controlItem.id;
    this.showTextAreaDiv = true;
    this.textAreaFormControl.enable();
    this.showDialogOfControlGrid();
  }
  initAndOpenInputDivOfLinkBox = (type: number, json: any): void => {
    this.tempTextOfInput = (json[0] !== null) ? json[0] : ''; // title
    this.tempTextOfTextArea = (json[1] !== null) ? json[1] : ''; // url
    this.showTextInputBoxDiv = true;
    this.showTextAreaDiv = true;
    if (type === 1) {
      this.showViewLinkDiv = true;
      this.textInputFormControl.disable();
      this.textAreaFormControl.disable();
    } else {
      this.showViewLinkDiv = false;
      this.textInputFormControl.enable();
      this.textAreaFormControl.enable();
    }
    this.showDialogOfControlGrid();
  }
  copyNameFromOldObjToNewObj = (oldObj: any, newObj: any, addSuffix: string): void => {
    newObj.name = oldObj.name + addSuffix;
    // change children name too
    if (newObj.className === 'Group') {
      for (let i = 0; i < newObj.children.length; i++) {
        newObj.children[i].name = oldObj.children[i].name + addSuffix;
      }
    }
  }
  moveObjectsFromTempLayerToActiveLayer = (): void => {
    if (this.currentPathNumber > 0) {
      // for pen function only
      // do following only if at least one stroke is added
      this.tempGroup = new paper.Group();
      for (let i = 0; i < this.currentPathNumber; i++) {
        this.tempGroup.addChild(this.tempPathArr[i]);
      }
      this.tempGroup.name = 'stroke-path-group';
      this.scope.project.layers[this.currentActiveLayerNumber].addChild(this.tempGroup);
      this.currentPathNumber = 0;
    } else {
      // for non-pen function
      const tempDrawingLayer = this.scope.project.layers[this.scope.project.layers.length - 1];
      for (let i = 0; i < tempDrawingLayer.children.length; i++) {
        const obj = tempDrawingLayer.children[i];
        let boolTransfer = true;
        // check if the object is mask
        if (obj.name === 'mask') {
          boolTransfer = false;
        }
        // check text contains text or not
        if (obj.name === 'text') {
          const textItem = this.getTextItemFromControlItem(this.controlItem);
          if (textItem) {
            const textContent = textItem.content;
            if (textContent === null || textContent === '') {
              boolTransfer = false;
              // remove this object from temp layer
              obj.remove();
            }
          } else {
            console.error('moveObjectsFromTempLayerToActiveLayer error - no text item found');
          }
        }
        if (boolTransfer) {
          this.scope.project.layers[this.currentActiveLayerNumber].addChild(obj);
        }
      }
    }
  }
  resizeCanvas = (event: UIEvent): void => {
    // console.log('client w,h: (' + canvas.clientWidth + ',' + canvas.clientHeight + ')');
    // this method will be called if window size changes
    // adjust height based on width
    // console.log('---do resizeCanvas---');
    try {
      // canvas resized,
      // bug 1 - somehting wrong here when the screen is resized.
      // bug 2 - layers change quick
      if (this.canvas.clientWidth !== 0 && this.canvas.clientHeight !== 0) {
        let w = this.DEFAULT_BOARD_WIDTH;
        let h = this.DEFAULT_BOARD_HEIGHT;
        if (this.canvas.clientWidth < this.DEFAULT_BOARD_WIDTH) {
          w = this.canvas.clientWidth;
          h = Math.floor(h * w / this.DEFAULT_BOARD_WIDTH);
        }
        this.canvas.style.height = h + 'px';
        // adjust zoom
        if (this.scope.view) {
          // set new view size
          const w2 = this.canvas.clientWidth;
          const h2 = this.canvas.clientHeight;
          this.scope.view.viewSize = new paper.Size(w2, h2);
          // adjust zoom
          const factor = this.canvas.clientWidth >= this.DEFAULT_BOARD_WIDTH ? 1 : this.canvas.clientWidth / this.DEFAULT_BOARD_WIDTH;
          // this is important since the paper board may become very small sometimes (e.g. set game option)
          if (factor !== 0) {
            this.scope.view.zoom = factor;
            this.scope.view.center = new paper.Point({
              x: this.DEFAULT_BOARD_WIDTH / 2,
              y: this.DEFAULT_BOARD_HEIGHT / 2
            });
            this.scope.view.draw();
          }
        } else {
          console.log('adjustZoom error - no this.scope.view is found');
        }
      }
    } catch (e) {
      // console.error('--- resizeCanvas (canvas) - p1 error ---');
      // console.error(e);
    }
    // dialog
    try {
      // update dialog
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      if (this.dialogRef) {
        this.dialogRef.updateSize(
          (windowWidth <= this.DIALOG_LIMIT_WIDTH) ? this.DIALOG_SMALL_WIDTH + 'px' : '',
          (windowHeight <= this.DIALOG_LIMIT_HEIGHT) ? this.DIALOG_SMALL_HEIGHT + 'px' : ''
        );
      }
    } catch (e) {
      // console.error('--- resizeCanvas (dialog) - p2 error ---');
      // console.error(e);
    }
  }
  roundPath = (path: paper.Path, radius: number): paper.Path => {
    const segments = path.segments.slice(0);
    path.segments = [];
    for (let i = 0, l = segments.length; i < l; i++) {
      const curPoint = segments[i].point;
      const nextPoint = segments[i + 1 === l ? 0 : i + 1].point;
      const prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
      const nextDelta = curPoint.subtract(nextPoint);
      const prevDelta = curPoint.subtract(prevPoint);
      nextDelta.length = radius;
      prevDelta.length = radius;
      path.add(
        new paper.Segment(
          curPoint.subtract(prevDelta),
          null,
          prevDelta.divide(2)
        )
      );
      path.add(
        new paper.Segment(
          curPoint.subtract(nextDelta),
          nextDelta.divide(2),
          null
        )
      );
    }
    path.closed = true;
    return path;
  }
  createCommentBoxPath = (eRect: paper.Rectangle): paper.PathItem => {
    const comment = new paper.Path.Ellipse(eRect);
    comment.strokeColor = 'black';
    comment.fillColor = 'white';
    const tri = new paper.Path();
    tri.add(new paper.Point(comment.bounds.bottomLeft.x, comment.bounds.bottomLeft.y));
    tri.add(new paper.Point(comment.bounds.topCenter.x, comment.bounds.topCenter.y));
    tri.add(new paper.Point(comment.bounds.rightCenter.x, comment.bounds.rightCenter.y));
    tri.closed = true;
    const commentBox = comment.unite(tri);
    comment.remove();
    tri.remove();
    return commentBox;
  }
  createLinkBoxPath = (eRect: paper.Rectangle): paper.PathItem => {
    const b = new paper.Point(eRect.bottomCenter);
    const bl = new paper.Point(eRect.bottomLeft);
    const br = new paper.Point(eRect.bottomRight);
    const t = new paper.Point(eRect.topCenter);
    const tl = new paper.Point(eRect.topLeft);
    const tr = new paper.Point(eRect.topRight);
    const diamond = new paper.Path();
    diamond.strokeColor = 'black';
    diamond.fillColor = 'white';
    diamond.add(new paper.Point((b.add(bl)).divide(2)));
    diamond.add(new paper.Point(eRect.leftCenter));
    diamond.add(new paper.Point((t.add(tl)).divide(2)));
    diamond.add(new paper.Point((t.add(tr)).divide(2)));
    diamond.add(new paper.Point(eRect.rightCenter));
    diamond.add(new paper.Point((b.add(br)).divide(2)));
    diamond.closed = true;
    return diamond;
  }
  // --- for limiting view during adjusting view's zoom and transformation---
  boolAcceptViewCenter = (checkingPt: paper.Point): boolean => {
    const dw = this.scope.view.size.width / 2;
    const dh = this.scope.view.size.height / 2;
    const viewTopLeftX = checkingPt.x - dw;
    const viewTopLeftY = checkingPt.y - dh;
    const viewBottomRightX = checkingPt.x + dw;
    const viewBottomRightY = checkingPt.y + dh;
    // console.log('viewTopLeft:(' + viewTopLeftX + ',' + viewTopLeftY + ')');
    // console.log('viewBottomRight:(' + viewBottomRightX + ',' + viewBottomRightY + ')');
    let boolAcceptable = true;
    if (checkingPt.x < this.scope.view.center.x && viewTopLeftX < -this.ALLOWED_TRANSFORM_GAP) {
      boolAcceptable = false;
    }
    if (checkingPt.y < this.scope.view.center.y && viewTopLeftY < -this.ALLOWED_TRANSFORM_GAP) {
      boolAcceptable = false;
    }
    if (checkingPt.x > this.scope.view.center.x && viewBottomRightX > this.DEFAULT_BOARD_WIDTH + this.ALLOWED_TRANSFORM_GAP) {
      boolAcceptable = false;
    }
    if (checkingPt.y > this.scope.view.center.y && viewBottomRightY > this.DEFAULT_BOARD_HEIGHT + this.ALLOWED_TRANSFORM_GAP) {
      boolAcceptable = false;
    }
    return boolAcceptable;
  }
  saveChallengeFromPaperArr(model: any) {
    console.log('--- save skyboard in create mode---');
    // --- new type of save (v1.2): multi-pages ---
    model['paperVersion'] = 1.2;
    model['paper'] = this.currentPaperArr;
    model['sampleAnswers'] = this.currentSampleAnswerArr;
    this.uploadChallengeQuestion(model);
    // console.log(sampleAnswerArr);
    // console.log(model);

    // --- un-comment below to use new save file ---
    const json = JSON.stringify(model);
    const blob = new Blob([json], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, model['questionName'] + '.json');
  }
  // declare & initailze array of paper json if needed
  initPaperArr = (pageSize:number): void => {
    // console.log('pageSize = ' + pageSize);
    while(this.currentPaperArr.length < pageSize/10){
      this.currentPaperArr.push(new Array());
      this.currentSampleAnswerArr.push(new Array());
    }
    // console.log(this.currentPaperArr.length);
  }
  // ---------------------------------
  // --- For Create Challenge --------
  // ---------------------------------
  saveSampleAnswerOfCurrentPage = (sampleAnsArr: any): void => {
    const sa = new Array();
    for (let j = 0; j < this.scope.project.layers[3].children.length; j++) {
      const obj = this.scope.project.layers[3].children[j];
      if (obj) {
        console.log('found obj - ' + obj.id + '-' + obj.name);
        switch (obj.name) {
          case 'answer-box-group':
          case 'comment-box-group':
            const jsonItem = this.getJSONItemFromControlItem(obj);
            if (jsonItem) {
              // save sample answers
              const json = JSON.parse(jsonItem.content);
              sa.push(json);
            }
            break;
          default:
            break;
        }
      }
    }
    sampleAnsArr[this.currentPageNumber - 1] = sa;
    console.log('--- Finished saving sample answer---');
    // console.log(sampleAnsArr);
  }
  saveCurrentChallengeLayerstoPaper = (): void => {
    console.log('saveCurrentChallengeLayerstoPaper');
    console.log('--- before saving ---');
    // this.printAllObjectsByLayers();
    const paperArr = new Array(4);
    const sampleAnswerArr = new Array();
    for (let i = 1; i <= 4; i++) {
      paperArr[i - 1] = new Array();
      console.log('length = ' + this.scope.project.layers[i].children.length);
      for (let j = 0; j < this.scope.project.layers[i].children.length; j++) {
        const obj = this.scope.project.layers[i].children[j];
        const objArr = new Array();
        if (obj) {
          console.log('found obj - ' + obj.id + '-' + obj.name);
          switch (obj.name) {
            case 'stroke-path-group':
            case 'circle':
            case 'rectangle':
            case 'line':
            case 'arrow-line-group':
            case 'text':
            case 'picture':
            case 'answer-box-group':
            case 'comment-box-group':
            case 'link-box-group':
              // remove and save challenger answers
              if (obj.name === 'answer-box-group' || obj.name === 'comment-box-group') {
                const jsonItem = this.getJSONItemFromControlItem(obj);
                if (jsonItem) {
                  // save sample answers
                  const json = JSON.parse(jsonItem.content);
                  sampleAnswerArr.push(json);
                  // remove answers
                  // --- 0 - answer, 1 - comment, 2 - case sensitive, 3 - id
                  const newVal = JSON.stringify([
                    '',
                    '',
                    (json[2] !== null) ? json[2] : '',
                    (json[3] !== null) ? json[3] : ''
                  ]);
                  jsonItem.content = newVal;
                }
              }
              // put objects into paper
              objArr.push(obj.id);
              objArr.push(obj.name);
              objArr.push(obj.exportJSON({asString: true}));
              paperArr[i - 1].push(objArr);
              break;
            default:
              break;
          }
        }
      }
    }
    this.currentPaperArr[this.currentPageNumber - 1] = paperArr;
    this.currentSampleAnswerArr[this.currentPageNumber - 1] = sampleAnswerArr;
    console.log('--- Finished saving ---');
    console.log(this.currentPaperArr);
    console.log(this.currentSampleAnswerArr);
  }
  // ------------------------------
  // --- For Play Challenge -------
  // ------------------------------
  savePlayerAnswerOfCurrentPage = (submitArr: any): void => {
    console.log('savePlayerAnswerOfCurrentPage');
    const answersArr = new Array();
    for (let j = 0; j < this.scope.project.layers[6].children.length; j++) {
      const obj = this.scope.project.layers[6].children[j];
      if (obj) {
        console.log('found obj - ' + obj.id + '-' + obj.name);
        switch (obj.name) {
          case 'answer-box-group-from-teacher':
          case 'comment-box-group-from-teacher':
            const jsonItem = this.getJSONItemFromControlItem(obj);
            if (jsonItem) {
              // save sample answers
              const json = JSON.parse(jsonItem.content);
              let val = [
                (json[0] !== null)? json[0]:"",
                (json[1] !== null)? json[1]:"",
                json[2],
                this.mapQuestionBoxIdtoModelId[json[3]]
              ];
              answersArr.push(val);
            }
            break;
          default:
            break;
        }
      }
    }
    submitArr['answersC'][this.currentPageNumber - 1] = answersArr;
    console.log('--- Finished savePlayerAnswerOfCurrentPage---');
    console.log(submitArr['answersC']);
  }
  saveCurrentAnswersLayerstoPaper(submitArr: any) {
    console.log('--- saveCurrentAnswersLayerstoPaper (from layer 6 to 10)---');
    const paperArr = new Array(5);
    for (let i = 0; i < 5; i++) {
      const layerArr = new Array();
      for (let j = 0; j < this.scope.project.layers[i+6].children.length; j++) {
        const obj = this.scope.project.layers[i+6].children[j];
        const objArr = new Array();
        if (obj) {
          switch (obj.name) {
            case 'stroke-path-group':
            case 'circle':
            case 'rectangle':
            case 'line':
            case 'arrow-line-group':
            case 'text':
            case 'picture':
              // put objects into paper
              objArr.push(obj.id);
              objArr.push(obj.name);
              objArr.push(obj.exportJSON({asString: true}));
              layerArr.push(objArr);
              break;
            default:
              break;
          }
        }
      }
      paperArr[i] = layerArr;
    }
    submitArr['paper'][this.currentPageNumber - 1] = paperArr;
    console.log('--- Finished saveCurrentAnswersLayerstoPaper ---');
    console.log(submitArr['paper']);
  }
  uploadChallengeQuestion = (values: any): void => {
    try {
      const token = this.cs.localStorageItem('jwttoken');
      this.skyboardService.saveChallengeQuestion(token, values).then((result) => {
        if (result['success']) {
          // router
          this.router.navigateByUrl('/challenge-you').then(nav => {
            console.log(nav); // true if navigation is successful
          }, err => {
            console.log(err) // when there's an error
          });
        }
      }, (err) => {
        // show error why cannot register
        // console.log(err);
        try {
          const body = JSON.parse(err['_body']);
          const msg = body['msg'];
          // this.openSnackBarForRetry(msg + ' Press "Try Again" or wait 10 seconds to unlock login button', 'Try Again');
        } catch (ex2) {
          // this.openSnackBarForRetry(' Cannot connect to the server, press "Try Again" or wait 10 seconds to unlock login button', 'Try Again');
        }
      });
    } catch (ex) {
      // this.openSnackBarForRetry(' Cannot connect to the server, press "Try Again" or wait 10 seconds to unlock login button', 'Try Again');
    }
  }
  acceptAChallenge = (): void => {
    const model = {
      questionId: this.modelArr['_id'] //
    };
    const token = this.cs.localStorageItem('jwttoken');
    this.skyboardService.acceptAChallenge(token, model).then((result) => {
      if (result['success']) {
        console.log('challenge accepted');
        // change state and store return obj as an initial state of answer
        const jsonMsg = JSON.stringify(['change-stage-to-play', result['msg']]);
        this.onActivateProcess.emit(jsonMsg);
      } else {
        console.error(result['msg']);
      }
    },(err) => {
      if (this.isTesting) {
        console.log('--- In Testing ---');
        // change state and store return obj as an initial state of answer
        const jsonMsg = JSON.stringify(['change-stage-to-play', 'testing']);
        this.onActivateProcess.emit(jsonMsg);
      } else {
        console.error(err);
      }
    });
  }
  acceptUpdateAChallenge = (): void => {
    const submit = {
      _id: this.submitArr['_id'] //
    };
    const token = this.cs.localStorageItem('jwttoken');
    this.skyboardService.acceptUpdateAChallenge(token, submit).then((result) => {
      if (result['success']) {
        console.log('challenge update accepted');
        // change state and store return obj as an initial state of answer
        const jsonMsg = JSON.stringify(['change-stage-to-play', result['msg']]);
        this.onActivateProcess.emit(jsonMsg);
      } else {
        console.error(result['msg']);
      }
    }, (err) => {
      // show error
      console.error(err);
    });
  }
  showDialogOfControlGrid = (): void => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (windowWidth <= 768) {
      this.dialogRef = this.dialog.open(SkyboardDialogComponent, {
        disableClose: true,
        width: (windowWidth <= this.DIALOG_LIMIT_WIDTH) ? this.DIALOG_SMALL_WIDTH + 'px' : '',
        height: (windowHeight <= this.DIALOG_LIMIT_HEIGHT) ? this.DIALOG_SMALL_HEIGHT + 'px' : '',
        data: {
          showTextInputBoxDiv: this.showTextInputBoxDiv,
          showCaseSensitiveDiv: this.showCaseSensitiveDiv,
          showTextAreaDiv: this.showTextAreaDiv,
          tempTextOfInput: this.tempTextOfInput,
          tempCaseSensitive: this.tempCaseSensitive,
          tempTextOfTextArea: this.tempTextOfTextArea,
          tiPlaceholder: this.tiPlaceholder,
          taPlaceholder: this.taPlaceholder
        }
      });
      // do following when the dialog is closed
      this.closeDialogSubscription = this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('dialogRef saved');
          if (this.tempTextOfInput !== result.tempTextOfInput) {
            this.tempTextOfInput = result.tempTextOfInput;
            this.onChangeOfTextInput(null);
          }
          if (this.tempCaseSensitive !== result.tempCaseSensitive) {
            this.tempCaseSensitive = result.tempCaseSensitive;
            this.onChangeOnCaseSensitive(null);
          }
          if (this.tempTextOfTextArea !== result.tempTextOfTextArea) {
            this.tempTextOfTextArea = result.tempTextOfTextArea;
            this.onChangeOnTextArea(null);
          }
        } else {
          console.log('dialogRef cancel');
        }
        this.activateTool('done');
        this.scope.project.layers[this.currentActiveLayerNumber].activate();
      });
    }
  }
  fileUpload = (event): void => {
    console.log('file upload now');
    if (event.target.files && event.target.files[0]) {
      this.myFileReader = new FileReader();
      this.myFileReader.onload = (e: any) => {
        // should remove loading icon
        if (event.target.files[0].type === 'application/json' || event.target.files[0].type === 'text/plain' ) {
          // upload a save file
          const text = e.target.result;
          const modelArr = JSON.parse(text);
          this.initPaperData(modelArr);
          this.loadPaperForOnePage(true, true, false);
          // update form
          const jsonMsg1 = JSON.stringify(['update-form', text]);
          this.onActivateProcess.emit(jsonMsg1);
          // --- reset screen ----
          const jsonMsg2 = JSON.stringify(['activate-layer', this.LAYERS_NAME[this.currentActiveLayerNumber]]);
          this.onActivateProcess.emit(jsonMsg2);
          this.activateTool('done');
          this.activateTool('nothing');
        } else {
          // upload a picture
          if (e.target.result) {
            this.myTempFileData = e.target.result;
          } else {
            console.error('file upload error - myTempFileData not found.');
          }
          event.target.value = ''; // reset for capturing new input next time
          this.activateTool('file-input');
        }
      }
      console.log('event.target.files[0].type = ' + event.target.files[0].type);
      if (event.target.files[0].type === 'text/plain') { // version 1.0
        this.myFileReader.readAsText(event.target.files[0]);
      } else if (event.target.files[0].type === 'application/json') { // version 1.1 or above
        this.myFileReader.readAsText(event.target.files[0]);
      } else {
        this.myFileReader.readAsDataURL(event.target.files[0]);
      }
      // should show loading icon and lock screen
    } else {
      console.error('file upload error - no file is uploaded.');
    }
  }
  initPaperData = (modelArr: any): void => {
    console.log('initPaperData');
    // input data
    this.currentPaperArr = modelArr['paper'];
    this.currentSampleAnswerArr = modelArr['sampleAnswers'];
    // update map id to answer and comment
    for (let i = 0; i < this.currentSampleAnswerArr.length; i++) {
      for (let j = 0; j < this.currentSampleAnswerArr[i].length; j++) {
        // console.log(this.currentSampleAnswerArr[i][j]);
        const id = this.currentSampleAnswerArr[i][j][3];
        this.mapModelIdToSampleAnswer[id] = this.currentSampleAnswerArr[i][j][0];
        this.mapModelIdToSampleComment[id] = this.currentSampleAnswerArr[i][j][1];
      }
    }
    const jsonMsg = JSON.stringify(['update-page-size', modelArr['numberOfPages']]);
    this.onActivateProcess.emit(jsonMsg);
  }
  updatedQuestionsBoxesJSONAndMapping = (needInputAns: boolean): void => {
    console.log('updatedQuestionsBoxesJSONAndMapping');
    for (let j = 0; j < this.scope.project.layers[4].children.length; j++) {
      const obj = this.scope.project.layers[4].children[j];
      if (obj.name === 'answer-box-group' || obj.name === 'comment-box-group') {
        const jsonItem = this.getJSONItemFromControlItem(obj);
        const json = JSON.parse(jsonItem.content);
        this.mapQuestionBoxIdtoModelId[obj.id]=json[3];
        let val = [
          needInputAns?this.mapModelIdToSampleAnswer[json[3]]:"",
          needInputAns?this.mapModelIdToSampleComment[json[3]]:"",
          (json[2] !== null)? json[2]:null,
          obj.id
        ];
        const newJSON = JSON.stringify(val);
        if (jsonItem) {
          jsonItem.content = newJSON;
        }
      }
    }
  }
  loadPaperForOnePage = (needInputAns: boolean, needToShowText: boolean, isFromPlayChallenge: boolean): void => {
    console.log('loadPaperForOnePage');
    // remove board's everything & create a new empty board
    this.scope.project.clear();
    for (let i = 0; i < this.LAYERS_NAME.length; i++) {
      this.initLayer(i);
    }
    // for import questions
    if (this.currentPaperArr[this.currentPageNumber - 1]) {
      this.transferJSONObjectToPaperForPage(
        this.currentPaperArr[this.currentPageNumber - 1],
        this.currentSampleAnswerArr[this.currentPageNumber - 1]
      );
      this.updatedQuestionsBoxesJSONAndMapping(needInputAns);
    } else {
      console.error('no paper arr is found with current page number' + this.currentPageNumber);
    }
    // for import play challenge
    if (isFromPlayChallenge){
      // duplicate selective items (invisible bounds only) to layer 6 (student-work layer)
      this.duplicateInviBoxesToLayer(this.submitArr);
      this.transferAnswersOfJSONObjectToPaperForPage(this.submitArr['paper'][this.currentPageNumber - 1]);
    }
    if (needToShowText) {
      this.showTextOfAllAnswerAndCommentBoxes();
    }
    // testing
    // this.printAllObjectsByLayers();
  }
  duplicateInviBoxesToLayer = (sa: any): void => {
    console.log('duplicateInviBoxesToLayer');
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < this.scope.project.layers[i].children.length; j++) {
        const obj = this.scope.project.layers[i].children[j];
        if (obj.name === 'answer-box-group' || obj.name === 'comment-box-group' || obj.name === 'link-box-group') {
          // clone invisible object to new layer
          const newObj = obj.clone();
          this.copyNameFromOldObjToNewObj(obj, newObj, '-from-teacher');
          newObj.opacity = 0.0; // invisible
          this.scope.project.layers[this.currentActiveLayerNumber].addChild(newObj);
          // 1) record
          if (newObj.name === 'answer-box-group-from-teacher' || newObj.name === 'comment-box-group-from-teacher') {
            const newJsonItem = this.getJSONItemFromControlItem(newObj);
            const newJson = JSON.parse(newJsonItem.content);
            const questionBoxId = newJson[3];
            const invBoxId = newObj.id;
            // console.log('mid = ' + this.mapQuestionBoxIdtoModelId[questionBoxId] + ', qbid = ' + questionBoxId + ', ibid = ' + invBoxId);
            this.mapInviBoxIdtoQuestionBox[invBoxId] = obj;
            this.mapInviBoxIdtoModelId[invBoxId] = this.mapQuestionBoxIdtoModelId[questionBoxId];
            // if submitted answer, input answers into json **
            if (sa) {
              if (sa['answersC']) {
                if (sa['answersC'][this.currentPageNumber - 1]){
                  const answerArrOfThePage = sa['answersC'][this.currentPageNumber - 1];
                  for (let k = 0; k < answerArrOfThePage.length; k++) {
                    const modelId = answerArrOfThePage[k][3];
                    if (modelId === this.mapInviBoxIdtoModelId[newObj.id]){
                      const playerAnswer = answerArrOfThePage[k][0];
                      const playerComment = answerArrOfThePage[k][1];
                      let val = [
                        playerAnswer,
                        playerComment,
                        (newJson[2] !== null)? newJson[2]:null,
                        questionBoxId // question box Id
                      ];
                      const newJSON = JSON.stringify(val);
                      newJsonItem.content = newJSON;
                      // show old obj text from new obj json
                      if (obj.name === 'answer-box-group') {
                        const text = playerAnswer; // answer
                        this.updateTextItemByNewTextInput(obj, text, false);
                      } else if (obj.name === 'comment-box-group') {
                        const text = playerComment; // comment
                        this.updateTextItemByNewTextInput(obj, text, false);
                      }
                      // For view-mode, check answer, if wrong, show red box
                      if (this.currentActiveLayerNumber === 10) {
                        const answer = playerAnswer.trim(); // remove front and trailed space
                        const cs = newJson[2];
                        const mid = questionBoxId;
                        const sampleAnswer = this.mapModelIdToSampleAnswer[this.mapQuestionBoxIdtoModelId[questionBoxId]];
                        if (cs !== "" && cs !== null) { // ignore comment box
                          if (cs && answer === sampleAnswer) {
                            // do nth if correct
                          } else if (!cs && answer.toString().toUpperCase() === sampleAnswer.toString().toUpperCase()) {
                            // do nth if correct
                          } else {
                            // console.log('obj - ' + obj.id + ' has wrong answer');
                            this.createColorDashedBorderOfBox(obj, 'red');
                          }
                        }
                      }
                    }
                  }
                } else {
                  console.log('duplicateInviBoxesToLayer - no answer from submitted array is found.');
                }
              }
            }
          }
        }
      }
    }
  }
  transferJSONObjectToPaperForPage = (pArr: any, sArr:any): void => {
    // paper version >= 1.2
    console.log('transferJSONObjectToPaperForPage');
    // loop paper array
    if (pArr) {
      for (let i = 0; i < pArr.length; i++) {// loop layers
        for (let j = 0; j < pArr[i].length; j++) { // objects
          const obj = pArr[i][j];
          if (obj) {
            const id = obj[0];
            const name = obj[1];
            const data = obj[2];
            this.putObjOnPaperAndDoBoxMapping(i, id, name, data, sArr);
          }
        }
      }
    }
    // --- debug ---
    console.log('--- End of transferJSONObjectToPaperForPage ---');
    // this.printAllObjectsByLayers();
    // -------------
  }
  transferAnswersOfJSONObjectToPaperForPage = (sArrForAPage: any): void => {
    // paper version >= 1.2
    console.log('transferAnswersOfJSONObjectToPaperForPage');
    // console.log(sArrForAPage);
    // loop paper array
    if (sArrForAPage) {
      for (let i = 0; i < sArrForAPage.length; i++) {// loop layers
        for (let j = 0; j < sArrForAPage[i].length; j++) { // objects
          const obj = sArrForAPage[i][j];
          if (obj) {
            const id = obj[0];
            const name = obj[1];
            const data = obj[2];
            console.log(obj.id + " " + obj.name);
            this.putObjOnPaperAndDoBoxMapping(i+5, id, name, data, null);
          }
        }
      }
    }
    // --- debug ---
    // console.log('--- End of transferJSONObjectToPaperForPage ---');
    // this.printAllObjectsByLayers();
    // -------------
  }
  putObjOnPaperAndDoBoxMapping = (layer:number, id: string, name: string, data: string, sampleArr:any): void => {
    switch (name) {
      case 'stroke-path-group':
      case 'circle':
      case 'rectangle':
      case 'line':
      case 'arrow-line-group':
      case 'text':
      case 'picture':
      case 'answer-box-group':
      case 'comment-box-group':
      case 'link-box-group':
      case 'dashed-border-for-wrong-answer':
        // id of the object will change after import
        // console.log('putObjOnPaperAndDoBoxMapping');
        // console.log('id = ' + id);
        // console.log('name = ' + name);
        this.scope.project.layers[layer+1].importJSON(data);//*layer+1 for arr.length
        // record model answers and comments (must be from challenge question)
        if (name === 'answer-box-group' || name === 'comment-box-group') {
          for (let k = 0; k < sampleArr.length; k++) {
            if (sampleArr[k][3] === id) {
              this.mapModelIdToSampleAnswer[id] = sampleArr[k][0];
              this.mapModelIdToSampleComment[id] = sampleArr[k][1];
            }
          }
        }
        break;
      default:
        break;
    }
  }
  resetObjectsAndArrays = (): void => {
    this.mapModelIdToSampleAnswer = {};
    this.mapModelIdToSampleComment = {};
    this.mapQuestionBoxIdtoModelId = {};
    this.mapInviBoxIdtoModelId = {};
    this.mapInviBoxIdtoQuestionBox = {};
    this.submitArr = {};
  }
  // type {0: play mode, 1: view mode}
  importChallenge = (type: number): void => {
    console.log('importChallenge');
    // console.log('--- model question ---');
    // console.log(this.modelArr);
    // console.log('--- submit result ---');
    // console.log(this.submitArr);
    const ma = this.modelArr;
    const sa = this.submitArr;
    if (ma) {
      // remove board's everything
      this.scope.project.clear();
      // --- import challenge ---
      if (ma['paper']) {
        this.initPaperData(ma);
        if (type === 0) {
          this.loadPageInPlayMode();
        }else {
          this.loadPageInViewMode();
        }
        // update canvas size after input data and appear on the screen
        setTimeout(() => {
          this.resizeCanvas(null);
          this.activateTool(this.initialActiveToolName);
          this.showSubmitDiv = true;
        }, 200);
      } else {
        console.error('Import Challenge - modelArr[\'paper\'] not found.');
      }
    } else {
      console.error('Import Challenge - modelArr not found.');
    }
  }
  importPlayersMarks = (): void => {
    // --- import players marks ---
    const qID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    const token = this.cs.localStorageItem('jwttoken');
    this.skyboardService.getPlayersMarksOfAChallengeQuestion(token, qID).then((result) => {
      if (result['success']) {
        console.log('--- importPlayersMarks Result ---');
        // console.log(result['msg']);
        this.playersMarksArr = [];
        this.playersMarksArr = result['msg'];
        let count = 0;
        let sum = 0;
        this.playerMarksChartData[0]['data'] = [];
        this.playerMarksChartLabels = [];
        let labelArr:string[] = [];
        let countArr = [];
        let fullMarks = this.submitArr['correctF'] + this.submitArr['wrongF'];
        for (let i = 0; i < this.playersMarksArr.length; i++){
          const arr = this.playersMarksArr[i];
          count += arr['count'];
          sum += arr['count'] * arr['_id']; // _id = mark
          countArr.push(arr['count']);
          labelArr.push(arr['_id'] + "/" + fullMarks);
        }
        this.playerMarksChartData[0]['data'] = countArr;
        this.playerMarksChartLabels = labelArr;
        this.avgCorrectF = sum / count;
      } else {
        console.error(result['msg']);
      }
    }, (err) => {
      console.error(err);
    });
  }
  importPlayersTimeSpents = (): void => {
    // --- import players marks ---
    console.log('importPlayersTimeSpents');
    const qID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    const token = this.cs.localStorageItem('jwttoken');
    this.skyboardService.getPlayersTimeSpentsOfAChallengeQuestion(token, qID).then((result) => {
      if (result['success']) {
        console.log('--- importPlayersTimeSpents Result ---');
        // console.log(result['msg']);
        this.playersTSArr = [];
        this.playersTSArr = result['msg'];
        // reset values
        let count = 0;
        let sum = 0;
        let min = 9999999;
        let max = -9999999;
        for (let i = 0; i < this.playersTSArr.length; i++){
          const arr = this.playersTSArr[i];
          count += arr['count'];
          sum += arr['count'] * arr['_id']; // _id = mark
          if (arr['_id'] < min) {
            min = arr['_id'];
          }
          if (arr['_id'] > max) {
            max = arr['_id'];
          }
        }
        // make 4 groups, between min to max
        const n1 = min;
        const n2 = min + ( (max - min) / 4 ) * 1;
        const n3 = min + ( (max - min) / 4 ) * 2;
        const n4 = min + ( (max - min) / 4 ) * 3;
        const n5 = max;
        this.playerTSChartLabels[0] = n1.toString()+'s-'+n2.toString()+'s';
        this.playerTSChartLabels[1] = n2.toString()+'s-'+n3.toString()+'s';
        this.playerTSChartLabels[2] = n3.toString()+'s-'+n4.toString()+'s';
        this.playerTSChartLabels[3] = n4.toString()+'s-'+n5.toString()+'s';
        this.playerTSChartData = [0,0,0,0];
        for (let i = 0; i < this.playersTSArr.length; i++){
          const arr = this.playersTSArr[i];
          const m = arr['_id'];
          if (m >= n1 && m < n2) {
            this.playerTSChartData[0]++;
          }else if (m >= n2 && m < n3) {
            this.playerTSChartData[1]++;
          }else if (m >= n3 && m < n4) {
            this.playerTSChartData[2]++;
          }else if (m >= n4 && m <= n5) {
            this.playerTSChartData[3]++;
          }
        }
        this.avgTS = sum / count;
      } else {
        console.error(result['msg']);
      }
    }, (err) => {
      console.error(err);
    });
  }
  importPlayerRank = (): void => {
    // --- import players rank ---
    const qID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    const uID = this.cs.localStorageItem('uid');
    const token = this.cs.localStorageItem('jwttoken');
    this.skyboardService.getPlayersRankOfAChallengeQuestion(token, qID, uID).then((result) => {
      if (result['success']) {
        console.log('--- importPlayerRank Result ---');
        this.rank = result['msg'][0] + 1;
        this.rankTotal = result['msg'][1];
      } else {
        console.error(result['msg']);
      }
    }, (err) => {
      console.error(err);
    });
    //
  }
  importPlayersAnswers = (): void => {
    console.log('importPlayersAnswers');
    const qID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    const token = this.cs.localStorageItem('jwttoken');
    this.skyboardService.getPlayersAnswersOfAChallengeQuestion(token, qID).then((result) => {
      if (result['success']) {
        console.log('--- importPlayersAnswers Result ---');
        const playersAnswersArr = result['msg'];
        const submittedAnswersNum: string[] = [];
        const submittedNoOfWrong = [];
        const submittedNoOfCorrect= [];
        const submittedAnswers = {};
        this.clearObject(this.playerCWChartDataForAnswerID);
        this.clearObject(submittedAnswers);
        const sampleAnswers = this.modelArr['sampleAnswers'];
        for (let i = 0; i < sampleAnswers.length; i++){
          for (let j = 0; j < sampleAnswers[i].length; j++){
            const cs = sampleAnswers[i][j][2];
            const mid = sampleAnswers[i][j][3];
            if (cs !== "" && cs !== null) {
              this.playerCWChartDataForAnswerID[mid] = [0,0];
              submittedAnswers[mid] = {};
            }
          }
        }
        for (let i = 0; i < playersAnswersArr.length; i++){
          const an = playersAnswersArr[i]['answerNumber'];
          const pa = playersAnswersArr[i]['answer'];
          const sa = this.mapModelIdToSampleAnswer[an];
          let arrIndex = submittedAnswersNum.indexOf('ID ' + an);
          // for number of correct and wrong answers to all players
          if (arrIndex == -1) {
            submittedAnswersNum.push('ID ' + an);
            submittedNoOfWrong.push(0);
            submittedNoOfCorrect.push(0);
            arrIndex = submittedAnswersNum.indexOf('ID ' + an);
          }
          if (pa === sa) {
            // correct
            submittedNoOfCorrect[arrIndex]++;
            this.playerCWChartDataForAnswerID[an][1]++;
          }else {
            // wrong
            submittedNoOfWrong[arrIndex]++;
            this.playerCWChartDataForAnswerID[an][0]++;
          }
          // for submitted answers stat
          if (submittedAnswers[an][pa] === undefined || submittedAnswers[an][pa] === null) {
            submittedAnswers[an][pa] = 1;
          }else {
            submittedAnswers[an][pa]++;
          }
        }
        // for number of correct and wrong answers to all players
        this.clearCharts(this.playersAnswersChartLabel, this.playersAnswersChartData);
        this.playersAnswersChartLabel = submittedAnswersNum;
        this.playersAnswersChartData[0].data = submittedNoOfWrong;
        this.playersAnswersChartData[0].label = 'Wrong';
        this.playersAnswersChartData[1].data = submittedNoOfCorrect;
        this.playersAnswersChartData[1].label = 'Correct';

        // for submitted answers stat - calculate highest 4 submitted answers
        for (let san in submittedAnswers) {
          if (submittedAnswers.hasOwnProperty(san)) {
            const answerObj = submittedAnswers[san];
            const sortedArr = this.sortObject(answerObj); // larger value first
            // [
            //    0:{key: "2", value: 2}
            //    1:{key: "abc", value: 1}
            // ]
            // shift space used before for showing in chartjs
            if (this.playerSAChartLabelForAnswerID[san]) {
              while(this.playerSAChartLabelForAnswerID[san].length !== 0) {
                this.playerSAChartLabelForAnswerID[san].shift();
              }
            } else {
              this.playerSAChartLabelForAnswerID[san] = [];
            }
            if (this.playerSAChartDataForAnswerID[san]) {
              while(this.playerSAChartDataForAnswerID[san].length !== 0) {
                this.playerSAChartDataForAnswerID[san].shift();
              }
            } else {
              this.playerSAChartDataForAnswerID[san] = [];
            }
            // add value
            for (let i = 0; i < sortedArr.length; i++) {
              if (i < 4) {
                this.playerSAChartLabelForAnswerID[san].push(sortedArr[i]['key']);
                this.playerSAChartDataForAnswerID[san].push(sortedArr[i]['value']);
              }else {
                if (i === 4) {
                  this.playerSAChartLabelForAnswerID[san].push('others');
                  this.playerSAChartDataForAnswerID[san].push(0);
                }
                this.playerSAChartDataForAnswerID[san][4]+=sortedArr[i]['value'];
              }
            }
            /*
              playerSAChartDataForAnswerID = {
                "43": ['A', 'B', 'C', 'D'],
                "51": ['Apple', 'Banana', 'Orange', 'Others']
              };
              playerSAChartLabelForAnswerID = {
                "43": [1, 2, 3, 4],
                "51": [30, 50, 20, 5]
              };
             */
          }
        }
      } else {
        console.error(result['msg']);
      }
    }, (err) => {
      console.error(err);
    });
  }
  clearCharts(label, data) {
    label = [];
    this.emptyChartData(data);
  }
  clearObject(obj){
    for (const prop of Object.keys(obj)) {
      delete obj[prop];
    }
  }
  emptyChartData(obj) {
    obj[0].data = [];
    obj[1].data = [];
    obj[0].label = 'label1';
    obj[1].label = 'label2';
  }
  sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        arr.push({
          'key': prop,
          'value': obj[prop]
        });
      }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    return arr; // returns array
  }
  setPlaceholder = (type: number): void => {
    // fromType {0 = text, 1 = answer, 2 = comment, 3 = link}
    if (type === 0) {
      this.taPlaceholder = 'Text';
    } else if (type === 1) {
      this.tiPlaceholder = 'Answer';
      this.taPlaceholder = 'Explanation/Comment';
    } else if (type === 2) {
      this.taPlaceholder = 'Comment';
    } else if (type === 3) {
      this.tiPlaceholder = 'Name';
      this.taPlaceholder = 'Link';
    }
  }
  // ---------------------
  // ---- Reset Values ---
  // ---------------------
  resetControlGridValues = (): void => {
    this.showDoneDiv = false;
    this.showTextInputBoxDiv = false;
    this.showCaseSensitiveDiv = false;
    this.showTextAreaDiv = false;
    this.showViewLinkDiv = false;
    this.textInputFormControl.enable();
    this.disableCaseSensitive = false;
    this.textAreaFormControl.enable();
    this.tempCaseSensitive = false;
    this.tempTextOfInput = '';
    this.tempTextOfTextArea = '';
    this.tiPlaceholder = 'Text';
    this.taPlaceholder = 'Text';
  }
  // ---------------------
  // ------UI Update -----
  // ---------------------
  showAllTools = (): void => {
    this.allTools.classList.remove('hidden-div');
  }
  hideAllTools = (): void => {
    this.allTools.classList.add('hidden-div');
  }
  showBoxToolDiv = (): void => {
    this.boxToolDiv.classList.remove('hidden-div');
  }
  hideBoxToolDiv = (): void => {
    this.boxToolDiv.classList.add('hidden-div');
  }
  showCanvas = (): void => {
    this.canvasDiv.classList.remove('hidden-div');
  }
  hideCanvas = (): void => {
    this.canvasDiv.classList.add('hidden-div');
  }
  showControlDiv = (): void => {
    this.controlDiv.classList.remove('hidden-div');
  }
  hideControlDiv = (): void => {
    this.controlDiv.classList.add('hidden-div');
  }
  showTextOfAllAnswerAndCommentBoxes = (): void => {
    console.log('showTextOfAllAnswerAndCommentBoxes');
    // for question
    for (let i = 0; i < this.scope.project.layers[4].children.length; i++) {
      const obj = this.scope.project.layers[4].children[i];
      if (obj.name === 'answer-box-group' || obj.name === 'comment-box-group') {
        const jsonItem = this.getJSONItemFromControlItem(obj);
        const json = JSON.parse(jsonItem.content);
        if (obj.name === 'answer-box-group') {
          // get text, sub string
          const text = (json[0] !== null) ? json[0] : ''; // answer
          // update text item
          this.updateTextItemByNewTextInput(obj, text, false);
        } else if (obj.name === 'comment-box-group') {
          // get text, sub string
          const text = (json[1] !== null) ? json[1] : ''; // comment
          // update text item
          this.updateTextItemByNewTextInput(obj, text, false);
        }
      }
    }
    // for answer
    const handleLayers = [6,10];
    for (let l = 0; l < handleLayers.length; l++) {
      for (let i = 0; i < this.scope.project.layers[handleLayers[l]].children.length; i++) {
        const obj = this.scope.project.layers[handleLayers[l]].children[i];
        if (obj.name === 'answer-box-group-from-teacher' || obj.name === 'comment-box-group-from-teacher') {
          const jsonItem = this.getJSONItemFromControlItem(obj);
          const json = JSON.parse(jsonItem.content);
          if (obj.name === 'answer-box-group-from-teacher') {
            // get text, sub string
            const text = (json[0] !== null) ? json[0] : ''; // answer
            // update text item
            this.updateTextItemByNewTextInput(this.mapInviBoxIdtoQuestionBox[obj.id], text, false);
          } else if (obj.name === 'comment-box-group-from-teacher') {
            // get text, sub string
            const text = (json[1] !== null) ? json[1] : ''; // comment
            // update text item
            this.updateTextItemByNewTextInput(this.mapInviBoxIdtoQuestionBox[obj.id], text, false);
          }
        }
      }
    }
  }
  hideTextOfAllAnswerAndCommentBoxes = (): void => {
    for (let i = 0; i < this.scope.project.layers[4].children.length; i++) {
      const obj = this.scope.project.layers[4].children[i];
      if (obj.name === 'answer-box-group' || obj.name === 'comment-box-group') {
        const jsonItem = this.getJSONItemFromControlItem(obj);
        const json = JSON.parse(jsonItem.content);
        if (obj.name === 'answer-box-group') {
          // get text, sub string
          const text = (json[0] !== null) ? json[0] : ''; // answer
          // update text item
          this.updateTextItemByNewTextInput(obj, text, true);
        } else if (obj.name === 'comment-box-group') {
          // get text, sub string
          const text = (json[1] !== null) ? json[1] : ''; // comment
          // update text item
          this.updateTextItemByNewTextInput(obj, text, true);
        }
      }
    }
  }
  removeAllControlsOfAnObject = (): void => {
    if (this.controllersGroup) {
      this.controllersGroup.remove();
      this.controllersGroup = null;
    }
    if (this.rotateController) {
      this.rotateController.remove();
      this.rotateController = null;
    }
    if (this.itemBound) {
      this.itemBound.remove();
      this.itemBound = null;
    }
    if (this.editBtn) {
      this.editBtn.remove();
      this.editBtn = null;
    }
  }
  createDashedBordersForAllObjectsInActiveLayer = (): void => {
    // console.log(this.scope.project.layers);
    for (let i = 0; i < this.scope.project.layers[this.currentActiveLayerNumber].children.length; i++) {
      const objName = this.scope.project.layers[this.currentActiveLayerNumber].children[i].name;
      if (
        objName !== 'mask' &&
        objName !== 'transform-controllers-group' &&
        objName !== 'rotate-button-group' &&
        objName !== 'edit-button' &&
        objName !== 'answer-box-group-from-teacher' &&
        objName !== 'comment-box-group-from-teacher' &&
        objName !== 'link-box-group-from-teacher' &&
        objName !== 'dashed-border-for-object' &&
        objName !== 'dashed-border-for-wrong-answer'
      ) {
        this.createDashedBorderOfAnObject(this.scope.project.layers[this.currentActiveLayerNumber].children[i]);
      }
    }
  }
  createDashedBorderOfAnObject = (obj: any): void => {
    const rect = this.initOriRect(obj);
    const objSelectedBounder = new paper.Path.Rectangle(rect);
    objSelectedBounder.name = 'dashed-border-for-object';
    objSelectedBounder.strokeWidth = this.SELECTABLE_BOUND_STROKE_WIDTH;
    objSelectedBounder.strokeColor = this.SELECTABLE_BOUND_STROKE_COLOR;
    objSelectedBounder.strokeCap = 'round';
    objSelectedBounder.dashArray = [10, 12];
    // put in the highest layer, this border can never be selected,
    // just for view and showing object is selectable
    this.scope.project.layers[this.scope.project.layers.length - 1].addChild(objSelectedBounder);
  }
  createColorDashedBorderOfBox = (obj: any, color: any): void => {
    const rect = this.initOriRect(obj);
    const objSelectedBounder = new paper.Path.Rectangle(rect);
    if (color === 'red') {
      // wrong answer
      objSelectedBounder.name = 'dashed-border-for-wrong-answer';
    } else {
      objSelectedBounder.name = 'dashed-border-for-object';
    }
    objSelectedBounder.strokeWidth = this.SELECTABLE_BOUND_STROKE_WIDTH;
    objSelectedBounder.strokeColor = color;
    objSelectedBounder.strokeCap = 'round';
    // put in the highest layer, this border can never be selected,
    // just for view and showing object is selectable
    this.scope.project.layers[this.scope.project.layers.length - 1].addChild(objSelectedBounder);
  }
  removeDashedBordersForAllObjects = (): void => {
    for (let i = this.scope.project.layers[this.scope.project.layers.length - 1].children.length - 1; i >= 0; i--) {
      const obj = this.scope.project.layers[this.scope.project.layers.length - 1].children[i];
      if (obj.name === 'dashed-border-for-object') {
        obj.remove();
      }
    }
  }
  createDashedBorderForTempLayer = (): void => {
    const tempDrawingLayer = this.scope.project.layers[this.scope.project.layers.length - 1];
    if (this.dashedBorder == null) {
      this.dashedBorder = new paper.Path.Rectangle({
        x: 1,
        y: 1,
        width: this.DEFAULT_BOARD_WIDTH - 2,
        height: this.DEFAULT_BOARD_HEIGHT - 2,
        fillColor: new paper.Color(255, 255, 255, 0.1),
        strokeColor: 'black'
      });
      this.dashedBorder.dashArray = [10, 12];
      this.dashedBorder.name = 'dashed-border';
    }
    tempDrawingLayer.addChild(this.dashedBorder);
  }
  removeDashedBorderForTempLayer = (): void => {
    if (this.dashedBorder) {
      this.dashedBorder.remove();
      this.dashedBorder = null;
    }
  }
  hazyNonTempLayers = (): void => {
    // = play or view mode
    if (this.currentActiveLayerNumber >= 6) {
      for (let i = 1; i < this.scope.project.layers.length - 1; i++) {
        if (i <= 4) {
          this.scope.project.layers[i].opacity = 1;
        } else {
          this.scope.project.layers[i].opacity = 0.5;
        }
      }
    } else {
      for (let i = 1; i < this.scope.project.layers.length - 1; i++) {
        this.scope.project.layers[i].opacity = 0.5;
      }
    }
  }
  clearNonDrawingLayers = (activeLayerNumber: number): void => {
    if (activeLayerNumber === 5) {
      console.log('activeLayerNumber === 5');
      // this is for game option, creating thumbnail.
      for (let i = 1; i < this.scope.project.layers.length - 1; i++) {
        this.scope.project.layers[i].opacity = 1;
      }
    } else {
      for (let i = 1; i < this.scope.project.layers.length - 1; i++) {
        if (i <= activeLayerNumber) {
          this.scope.project.layers[i].opacity = 1;
        } else {
          this.scope.project.layers[i].opacity = 0.5;
        }
      }
    }
  }
  // ------------------------
  // --- init controllers ---
  // ------------------------
  initLayer = (i: number): void => {
    this.scope.project.layers[i] = new paper.Layer();
    const myLayer = this.scope.project.layers[i];
    const mask = new paper.Path.Rectangle({
      x: 0,
      y: 0,
      width: this.DEFAULT_BOARD_WIDTH,
      height: this.DEFAULT_BOARD_HEIGHT,
      fillColor: 'black',
      strokeColor: 'black'
    });
    mask.name = 'mask';
    myLayer.addChild(mask);
    myLayer.clipped = true;
    // --- Set Background ---
    if (i === 0) {
      myLayer.activate();
      const bgWhiteBoard = new paper.Path.Rectangle({
        x: 0,
        y: 0,
        width: this.DEFAULT_BOARD_WIDTH,
        height: this.DEFAULT_BOARD_HEIGHT,
        fillColor: 'white',
        strokeColor: 'grey'
      });
      bgWhiteBoard.name = 'white-board';
      myLayer.addChild(bgWhiteBoard);
    }
  }
  initItemBound = (): void => {
    if (this.itemBound) {
      this.itemBound.strokeWidth = this.SCALING_BOUND_STROKE_WIDTH;
      this.itemBound.strokeColor = this.SCALING_BOUND_STROKE_COLOR;
      this.itemBound.strokeCap = 'round';
      this.itemBound.dashArray = [10, 12];
    }
  }
  initOriRect = (item: paper.Item): paper.Rectangle => {
    let b = item.bounds.clone(); // .expand(0, 0);
    if (b.width < this.MIN_LENGTH_OF_SCALING_BOUND || b.height < this.MIN_LENGTH_OF_SCALING_BOUND) {
      const width = b.width < this.MIN_LENGTH_OF_SCALING_BOUND ? this.MIN_LENGTH_OF_SCALING_BOUND : b.width;
      const height = b.height < this.MIN_LENGTH_OF_SCALING_BOUND ? this.MIN_LENGTH_OF_SCALING_BOUND : b.height;
      b = new paper.Rectangle(b.center.x - width / 2, b.center.y - height / 2, width, height);
    }
    return b;
  }
  initTransformController = (b: paper.Rectangle): paper.Group => {
    // selection rectangle (showings strokes)
    const mySR = new paper.Path.Rectangle(b);
    mySR.strokeWidth = this.SELECTION_STROKE_WIDTH;
    mySR.strokeColor = this.SELECTION_RECT_STROKE_COLOR;
    mySR.name = 'selection-rectangle'; // can ignore this if no specific action will be done to it
    const myTLCtrler = new paper.Path.Circle({
      center: b.topLeft,
      radius: this.CONTROLLER_RADIUS,
      fillColor: this.CONTROLLER_FILL_COLOR,
      strokeColor: this.CONTROLLER_STROKE_COLOR,
      name: 'top-left-button'
    });
    myTLCtrler.strokeWidth = this.SELECTION_STROKE_WIDTH;
    const myBLCtrler = new paper.Path.Circle({
      center: b.bottomLeft,
      radius: this.CONTROLLER_RADIUS,
      fillColor: this.CONTROLLER_FILL_COLOR,
      strokeColor: this.CONTROLLER_STROKE_COLOR,
      name: 'bottom-left-button'
    });
    myBLCtrler.strokeWidth = this.SELECTION_STROKE_WIDTH;
    const myTRCtrler = new paper.Path.Circle({
      center: b.topRight,
      radius: this.CONTROLLER_RADIUS,
      fillColor: this.CONTROLLER_FILL_COLOR,
      strokeColor: this.CONTROLLER_STROKE_COLOR,
      name: 'top-right-button'
    });
    myTRCtrler.strokeWidth = this.SELECTION_STROKE_WIDTH;
    const myBRCtrler = new paper.Path.Circle({
      center: b.bottomRight,
      radius: this.CONTROLLER_RADIUS,
      fillColor: this.CONTROLLER_FILL_COLOR,
      strokeColor: this.CONTROLLER_STROKE_COLOR,
      name: 'bottom-right-button'
    });
    myBRCtrler.strokeWidth = this.SELECTION_STROKE_WIDTH;
    const controllersGroup = new paper.Group([mySR, myTLCtrler, myBLCtrler, myTRCtrler, myBRCtrler]);
    controllersGroup.name = 'transform-controllers-group';
    return controllersGroup;
  }
  initRotationController = (b: paper.Rectangle): paper.Group => {
    const myRotateCircle = new paper.Path.Circle({
      center: [b.center.x, b.top - this.DISTANCE_BETWEEN_CONTROLLER_AND_ITEM],
      radius: this.CONTROLLER_RADIUS,
      fillColor: new paper.Color(255, 255, 255, 1),
      name: 'rotate-button-component'
    });
    const from1 = new paper.Point(b.center.x - 2, b.top - this.DISTANCE_BETWEEN_CONTROLLER_AND_ITEM + 2 + this.CONTROLLER_RADIUS);
    const through1 = new paper.Point(b.center.x, b.top - this.DISTANCE_BETWEEN_CONTROLLER_AND_ITEM - this.CONTROLLER_RADIUS);
    const to1 = new paper.Point(b.center.x + 2, b.top - this.DISTANCE_BETWEEN_CONTROLLER_AND_ITEM + 2 + this.CONTROLLER_RADIUS);
    const curvedPath = new paper.Path.Arc(from1, through1, to1);
    curvedPath.strokeWidth = this.SELECTION_STROKE_WIDTH;
    curvedPath.strokeColor = this.CONTROLLER_STROKE_COLOR;
    curvedPath.name = 'rotate-button-component';
    const from2 = new paper.Point(b.center.x + 2 + 2, b.top - this.DISTANCE_BETWEEN_CONTROLLER_AND_ITEM + 2 + this.CONTROLLER_RADIUS - 5);
    const straightLine2 = new paper.Path.Line(from2, to1);
    straightLine2.strokeWidth = this.SELECTION_STROKE_WIDTH;
    straightLine2.strokeColor = this.CONTROLLER_STROKE_COLOR;
    straightLine2.name = 'rotate-button-component';
    const from3 = new paper.Point(b.center.x + 2 + 5, b.top - this.DISTANCE_BETWEEN_CONTROLLER_AND_ITEM + 2 + this.CONTROLLER_RADIUS + 2);
    const straightLine3 = new paper.Path.Line(from3, to1);
    straightLine3.strokeWidth = this.SELECTION_STROKE_WIDTH;
    straightLine3.strokeColor = this.CONTROLLER_STROKE_COLOR;
    straightLine3.name = 'rotate-button-component';
    const myRotateCtrler = new paper.Group([myRotateCircle, curvedPath, straightLine2, straightLine3]);
    myRotateCtrler.name = 'rotate-button-group';
    return myRotateCtrler;
  }
  initEditController = (b: paper.Rectangle, name: string): paper.Raster => {
    if (name === 'text' || name === 'answer-box-group' || name === 'comment-box-group' || name === 'link-box-group') {
      const editButton = new paper.Raster({
        source: 'assets/icons/iconmonstr-gear-1-24.png',
        position: new paper.Point(b.rightCenter.x + this.DISTANCE_BETWEEN_CONTROLLER_AND_ITEM, b.top - this.DISTANCE_BETWEEN_CONTROLLER_AND_ITEM)
      });
      editButton.name = 'edit-button';
      return editButton;
    }
    return null;
  }
  // ------------------------
  // ------ Testing----------
  // ------------------------
  printAllObjectsByLayers = (): void => {
    console.log('-----------------------------');
    console.log('---printAllObjectsByLayers---');
    console.log('-----------------------------');
    console.log(this.scope.project.layers.length); // bug, sometimes 22.
    for (let i = 0; i < this.scope.project.layers.length; i++) {
      console.log('- Layer ' + i + ' -');
      for (let j = 0; j < this.scope.project.layers[i].children.length; j++) {
        const obj = this.scope.project.layers[i].children[j];
        console.log('--> ' + obj.id + ',' + obj.name + '');
      }
    }
  }
  printAllViewDetail = (): void => {
    console.log('------------------------');
    console.log('---printAllViewDetail---');
    console.log('------------------------');
    console.log('canvas.clientWidth = ' + this.canvas.clientWidth);
    console.log('canvas.clientHeight = ' + this.canvas.clientHeight);
    console.log('viewSize' + this.scope.view.viewSize);
    console.log('zoom = ' + this.scope.view.zoom);
    console.log('center = ' + this.scope.view.center);
  }
  isTesting = (): boolean => {
    const qID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    if (qID === 'testing') {
      return true;
    }else {
      return false;
    }
  }
}

