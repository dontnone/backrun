import fetch from 'isomorphic-fetch'
require('es6-promise').polyfill()
import Cookie from '../src/components/Util'
import { message } from 'antd'
import Url from './url'
  
//发送GET请求  
export function getFetch(url, params){  
    var str = '';  
    var gettype= Object.prototype.toString
    if(typeof params === 'object' && params){  
        str += '?';  
        Object.keys(params).forEach(function(val){  
            str += val + '=' + encodeURIComponent(params[val]) + '&'; 
        })  
    }
    return new Promise((resolve, reject)=> {
        fetch(url + str, {  
            method : 'GET',
            mode: 'cors', 
            headers:{
                "token": Cookie.getCookie('token'),
                Accept: 'application/json;charset=UTF-8',
            },
            // credentials: 'include'  
        }).then(function(res){  
            if(res.ok){  
                res.json().then( async function (data){  
                    if(data.code > 5000){
                        if(data.code == '5005'){
                                const datas = await postFetch(Url.tokenUpdate + '/' + Cookie.getCookie('token') + '/', {
                                    token: Cookie.getCookie('token')
                                }, 'PUT')
                                if(datas.code == 2000){
                                    await Cookie.setCookie('token', datas.data)
                                    location.reload();
                                    resolve(datas); 
                                }
                        }else{
                            message.info('登录失效，请重新登录')
                            setTimeout(()=> {
                                window.location.href = '/'
                            }, 2000)
                        }
                    }else if(data.code == 2000){
                        resolve(data); 
                    }else{
                        message.info(data.message)
                        reject(); 
                    }
                })  
            }else{  
                message.info('请求失败，请稍后重试')
                reject();  
            }  
        }, function(e){  
            message.info('请求失败，请稍后重试')
            reject();  
        }) 
    })
}  
      
//发送POST请求  
export function postFetch(url, params, type){  
    var typeStyle = type ? type : 'POST'
    var formParams = ''
    Object.keys(params).forEach(function(val){  
        formParams += val + '=' + encodeURIComponent(params[val]) + '&'; 
    }) 
    return new Promise((resolve, reject)=> {
        fetch(url, {  
            method : typeStyle,  
            mode: 'cors', 
            headers: {
                "token": Cookie.getCookie('token'),
                "Content-Type":  "application/x-www-form-urlencoded",
            },
            // credentials: 'include',
            body : formParams 
        }).then(function(res){  
            if(res.ok){  
                res.json().then(async function(data){  
                    if(data.code > 5000){
                        if(data.code == '5005'){
                            const datas = await postFetch(Url.tokenUpdate + '/' + Cookie.getCookie('token') + '/', {
                                token: Cookie.getCookie('token')
                            }, 'PUT')
                            if(datas.code == 2000){
                                await Cookie.setCookie('token', datas.data)
                                location.reload();
                                resolve(datas); 
                            }
                        }else{
                            message.info('登录失效，请重新登录')
                            setTimeout(()=> {
                                window.location.href = '/'
                            }, 2000)
                        }
                    }else if(data.code == 2000){
                        resolve(data); 
                    }else{
                        message.info(data.message)
                        reject();
                    }
                })  
            }else{  
                message.info('请求失败，请稍后重试')
                reject(); 
            }  
        }, function(e){  
            message.info('请求失败，请稍后重试') 
            reject();  
        }) 
    })
}  

//发送POST请求  
export function rowFetch(url, params){  
    console.log(url)
    console.log(params)
    return new Promise((resolve, reject)=> {
        fetch(url, {  
            method : 'POST',  
            mode: 'cors', 
            headers: {
                "token": Cookie.getCookie('token'),
                "Content-Type":  "application/json",
            },
            body : JSON.stringify(params) 
        }).then(function(res){  
            if(res.ok){  
                res.json().then(async function(data){  
                    if(data.code > 5000){
                        if(data.code == '5005'){
                            const datas = await postFetch(Url.tokenUpdate + '/' + Cookie.getCookie('token') + '/', {
                                token: Cookie.getCookie('token')
                            }, 'PUT')
                            if(datas.code == 2000){
                                await Cookie.setCookie('token', datas.data)
                                location.reload();
                                resolve(datas); 
                            }
                        }else{
                            message.info('登录失效，请重新登录')
                            setTimeout(()=> {
                                window.location.href = '/'
                            }, 2000)
                        }
                    }else if(data.code == 2000){
                        resolve(data); 
                    }else{
                        message.info(data.message)
                        reject();
                    }
                })  
            }else{  
                message.info('请求失败，请稍后重试')
                reject(); 
            }  
        }, function(e){  
            message.info('请求失败，请稍后重试') 
            reject();  
        }) 
    })
}  
