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

    // Application Constructor
    initialize: function() {
  
        var wsUri = "ws://192.168.1.143:8080";
		websocket = new WebSocket(wsUri);
		websocket.onopen = function(evt) { app.onOpen(evt) };
		websocket.onclose = function(evt) { app.onClose(evt) };
		websocket.onmessage = function(evt) { app.onMessage(evt) };
		websocket.onerror = function(evt) { app.onError(evt) };

    },
    onOpen: function(evt) {
        console.log("CONNECTED");
    },
    onClose: function(evt) {
        console.log("DISCONNECTED");
    },
    onMessage: function(evt) {
        
        if( evt.data.length > 10 ) {

            var str = "data:image/jpg;base64," + evt.data;
            $('#my_img').attr("src", str );
        }
    },
    onError: function(evt) {

        console.log( evt.data );
    }
};
