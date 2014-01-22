/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    timer:null,
    /*
    oldHeartRate: 0,
    stableHeartRateCount: 0,
    minHeartRate: 0,
    oldDiff: 0,
    avgMilliseconds: 0,
    oldMilliseconds: 0,
    totalMilliseconds: 0,
    countMilliseconds: 0,
	*/
	luma_old: 0,
	luma_stable_old: 0,
	luma_avg: 0,
	luma_min: 0,
	luma_max: 0,
	luma_total: 0,
	luma_count: 1,
	luma_old_milliseconds: 0,
	heart_rate: 0,
    
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
/*
        var wsUri = "ws://192.168.1.143:8080";
		websocket = new WebSocket(wsUri);
		websocket.onopen = function(evt) { app.onOpen(evt) };
		websocket.onclose = function(evt) { app.onClose(evt) };
		websocket.onmessage = function(evt) { app.onMessage(evt) };
		websocket.onerror = function(evt) { app.onError(evt) };
*/
        

        //this.callVideoPluginEcho();
        //this.callVideoPluginEchoThreading();
        //app.callVideoPluginInitVideo();
                
    },
    callVideoPluginEcho: function() {
    
        window.echo = function(str, callback) {
            cordova.exec(callback, function(err) {
                         callback('Nothing to echo.');
                         }, "VideoPlugin", "echo", [str]);
        };
        
        window.echo("ECHO", function(echoValue) {
            alert(echoValue); // should alert true.
        });
    },
    callVideoPluginEchoThreading: function() {
    
        window.echoThreading = function(str, callback) {
            cordova.exec(callback, function(err) {
                     callback('Nothing to echo.');
                     }, "VideoPlugin", "echoThreading", [str]);
        };
    
        window.echoThreading("ECHO2", function(echoValue) {
            alert(echoValue); // should alert true.
        });
    },
    callVideoPluginStartVideo: function() {

        window.startVideo = function(str, callback) {
            cordova.exec(callback, function(err) {
                    callback('Nothing to echo.');
                    }, "VideoPlugin", "startVideo", [str]);
        };

        window.startVideo("ECHO3", function(echoValue) {

            console.log("ECHO3(" + echoValue + ")");

            app.callVideoPluginGetVideoImage();
            
            app.timer = setInterval( function() {
                app.callVideoPluginGetVideoImage();
            }, 1000/16);
            
        });
    },
    callVideoPluginGetVideoImage: function() {
    
        window.getVideoImage = function(str, callback) {
            cordova.exec(callback, function(err) {
                    callback('Nothing to echo.');
                    }, "VideoPlugin", "getVideoImage", [str]);
        };
    
        window.getVideoImage("ECHO4", function(echoValue) {
 
            //console.log("luma("+echoValue+")");
            //websocket.send( echoValue );
       
            app.checkLuma(echoValue);
        });
    },
    callVideoPluginSetVideoImage: function( imageData ) {
    
        window.setVideoImage = function(str, callback) {
            cordova.exec(callback, function(err) {
                     callback('Nothing to echo.');
                     }, "VideoPlugin", "setVideoImage", [str]);
        };
    
        window.setVideoImage( imageData, function(echoValue) {
                         
            
        });
    },
    callVideoPluginStopVideo: function() {
    
        window.stopVideo = function(str, callback) {
            cordova.exec(callback, function(err) {
                    callback('Nothing to echo.');
                    }, "VideoPlugin", "stopVideo", [str]);
        };
        
        window.stopVideo("ECHO5", function(echoValue) {
                         
            console.log("ECHO5(" + echoValue + ")");
                         clearTimeout(app.timer);
        });
    },
    onOpen: function(evt) {
        console.log("CONNECTED");
    },
    onClose: function(evt) {
        console.log("DISCONNECTED");
    },
    onMessage: function(evt) {
        
        //console.log( "onMessage:" + evt.data );
        //console.log( "onMessage:" +  evt.data.length );
    
        if( evt.data.length > 10 ) {

            app.callVideoPluginSetVideoImage( evt.data );
        }
    },
    onError: function(evt) {
        console.log( evt.data );
    },
    
    checkLuma: function(luma) {
		
		if( luma != "" ) {
		
			// fix avg
			if( Math.abs( luma - app.luma_avg ) > 15 ) {
				
				app.luma_total = luma;
				app.luma_count = 1;
				app.luma_min = 0;
				app.luma_max = 0;
			}
			
			// 檢查是否穩定
			if( Math.abs( luma - app.luma_old ) <= 1 ) {
				
				if( app.luma_min == 0 )		app.luma_min = luma;
				if( luma < app.luma_min )	app.luma_min = luma;
				
				if( app.luma_max == 0 )		app.luma_max = luma;
				if( luma > app.luma_max )	app.luma_max = luma;	

				app.luma_total = Math.floor(app.luma_total) + Math.floor(luma);
				app.luma_count = Math.floor(app.luma_count) + 1;
				app.luma_avg = Math.floor( Math.floor(app.luma_total) / Math.floor(app.luma_count) );
				
				//console.log("luma("+ luma + ") avg(" + app.luma_avg + ") min(" + app.luma_min + ") max(" + app.luma_max + ")");

				// 劇烈變化
				if( Math.abs( luma - app.luma_stable_old ) >= 4 ) {
					
					var d = new Date();
                	var current = d.getTime();
					var diff =  Math.abs( current - app.luma_old_milliseconds );
				
					// 最低 心跳數/分 為 50  => 60/50  = 1.2秒 = 1200毫秒
					// 最高 心跳數/分 為 200 => 60/200 = 0.3秒 = 300毫秒
					if( diff >= 300 && diff <= 1200 ) {

						if( app.heart_rate == 0 )	app.heart_rate = diff;
						app.heart_rate = Math.floor( ( Math.floor(app.heart_rate) + diff ) / 2 );
					
						var bpm = Math.floor( (60 * 1000) / app.heart_rate );
						
						console.log("diff(" + diff + ") heart_rate(" + app.heart_rate + ") bpm(" + bpm + ")");
						
						// 心跳動畫
						$('#heart_img').transition({ scale: 0.8, delay: 0 }).transition({ scale: 1.0, delay: 100 });
						
						// 顯示 bpm
						$('#bpm_div').text(bpm);
					}

					app.luma_old_milliseconds = current;
				}
				
				
				app.luma_stable_old = luma;
			} else {
				/*
				// 脈搏
				if( Math.abs( luma - app.luma_avg ) <= 5 ) {
					
					console.log("hearrs("+ luma + ")");
				}
				*/
			}
			
			app.luma_old = luma;
			
			
		}
/*
        // 檢查是否穩定
        if( Math.abs( heartRate - app.oldHeartRate ) > 30 ) {

            app.oldHeartRate = heartRate;
            app.stableHeartRateCount = 0;
        } else {

            app.stableHeartRateCount++;
        }

        // 穩定中
        if( app.stableHeartRateCount > 20 ) {
            
            if( heartRate < app.minHeartRate ||  app.minHeartRate == 0 ) {
                
                app.minHeartRate = heartRate;
            }
            
            // 修正偏差
            if( app.stableHeartRateCount % 50 == 0 ) {
             
                app.minHeartRate = 0;
            }
            
            var diff = heartRate - app.minHeartRate;
            //console.log("heartRate("+heartRate+") diff("+diff+") min("+app.minHeartRate+") old("+app.oldHeartRate+")");
            

            if( diff == 0 ) {
                
                var d = new Date();
                var current = d.getTime();
                
                if( app.oldMilliseconds == 0 ) {
                    
                    app.oldMilliseconds = current;
                }
        
                var milliseconds = current - app.oldMilliseconds;
                if( milliseconds > 0 ) {
                    
                    app.totalMilliseconds += milliseconds;
                    app.countMilliseconds++;
    
                    app.avgMilliseconds = Math.floor( app.totalMilliseconds / app.countMilliseconds );
                    var bpm = Math.floor( 600000 / app.avgMilliseconds );
                    
                    console.log("("+app.totalMilliseconds+")("+app.countMilliseconds+")("+milliseconds+") avgMilliseconds("+app.avgMilliseconds+") bpm("+bpm+")");
                    $('#heart_rate_div').text(bpm);
                }
        
                app.oldMilliseconds = current;
            }
            
            
            
            app.oldDiff = diff;
            
     
        } else {
            
            app.minHeartRate = 0;
            app.oldMilliseconds = 0;
            app.totalMilliseconds = 0;
            app.countMilliseconds = 0;
        }
*/
    }
    
};
