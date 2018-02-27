import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {HttpHeaders} from "@angular/common/http";
@Injectable()
export class SkyboardService {

  constructor(private http: Http) { }

  saveChallengeQuestion(token, data) {
    // add authentication in header
    let headers = new Headers({ 'Authorization': token });
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.post('/api/challengequestion', data, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getAllChallengeQuestions(token) {
    // add authentication in header
    let headers = new Headers({ 'Authorization': token});
    // let headers;
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get('/api/challengequestion', options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getAChallengeQuestion(token, id) {
    // add authentication in header
    let headers = new Headers({ 'Authorization': token});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get('/api/challengequestion/'+id, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getPlayersMarksOfAChallengeQuestion(token, id){
    let headers = new Headers({ 'Authorization': token});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get('/api/playersmarks/'+id, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getPlayersTimeSpentsOfAChallengeQuestion(token, id){
    let headers = new Headers({ 'Authorization': token});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get('/api/playerstimespents/'+id, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getPlayersRankOfAChallengeQuestion(token, qid, uid) {
    let headers = new Headers({ 'Authorization': token});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get('/api/playersrank/qid/'+qid+'/uid/'+uid, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getPlayersAnswersOfAChallengeQuestion(token, id){
    let headers = new Headers({ 'Authorization': token});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get('/api/playersanswers/'+id, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  acceptAChallenge(token, data) {
    // add authentication in header
    let headers = new Headers({ 'Authorization': token });
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.post('/api/challengeanswer/accept', data, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getAChallengeAnswer(token, qid, uid) {
    // add authentication in header
    let headers = new Headers({ 'Authorization': token});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get('/api/challengeanswer/qid/'+qid+'/uid/'+uid, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  submitAnAnswer(token, data) {
    // add authentication in header
    let headers = new Headers({ 'Authorization': token });
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.post('/api/challengeanswer/submit', data, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  acceptUpdateAChallenge(token, data) {
    // add authentication in header
    let headers = new Headers({ 'Authorization': token });
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.post('/api/challengeanswer/acceptUpdate', data, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
}

/*
{var decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (e) {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
}
*/
