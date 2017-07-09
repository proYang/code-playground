/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "d4901580a6de41594e2e"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(110)(__webpack_require__.s = 110);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GraphQLError = __webpack_require__(25);

Object.defineProperty(exports, 'GraphQLError', {
  enumerable: true,
  get: function get() {
    return _GraphQLError.GraphQLError;
  }
});

var _syntaxError = __webpack_require__(201);

Object.defineProperty(exports, 'syntaxError', {
  enumerable: true,
  get: function get() {
    return _syntaxError.syntaxError;
  }
});

var _locatedError = __webpack_require__(202);

Object.defineProperty(exports, 'locatedError', {
  enumerable: true,
  get: function get() {
    return _locatedError.locatedError;
  }
});

var _formatError = __webpack_require__(203);

Object.defineProperty(exports, 'formatError', {
  enumerable: true,
  get: function get() {
    return _formatError.formatError;
  }
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQLNonNull = exports.GraphQLList = exports.GraphQLInputObjectType = exports.GraphQLEnumType = exports.GraphQLUnionType = exports.GraphQLInterfaceType = exports.GraphQLObjectType = exports.GraphQLScalarType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.isType = isType;
exports.assertType = assertType;
exports.isInputType = isInputType;
exports.assertInputType = assertInputType;
exports.isOutputType = isOutputType;
exports.assertOutputType = assertOutputType;
exports.isLeafType = isLeafType;
exports.assertLeafType = assertLeafType;
exports.isCompositeType = isCompositeType;
exports.assertCompositeType = assertCompositeType;
exports.isAbstractType = isAbstractType;
exports.assertAbstractType = assertAbstractType;
exports.getNullableType = getNullableType;
exports.isNamedType = isNamedType;
exports.assertNamedType = assertNamedType;
exports.getNamedType = getNamedType;

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _isNullish = __webpack_require__(14);

var _isNullish2 = _interopRequireDefault(_isNullish);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _assertValidName = __webpack_require__(50);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Predicates & Assertions

/**
 * These are all of the possible kinds of types.
 */
function isType(type) {
  return type instanceof GraphQLScalarType || type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType || type instanceof GraphQLEnumType || type instanceof GraphQLInputObjectType || type instanceof GraphQLList || type instanceof GraphQLNonNull;
}

function assertType(type) {
  (0, _invariant2.default)(isType(type), 'Expected ' + String(type) + ' to be a GraphQL type.');
  return type;
}

/**
 * These types may be used as input types for arguments and directives.
 */
function isInputType(type) {
  return type instanceof GraphQLScalarType || type instanceof GraphQLEnumType || type instanceof GraphQLInputObjectType || type instanceof GraphQLNonNull && isInputType(type.ofType) || type instanceof GraphQLList && isInputType(type.ofType);
}

function assertInputType(type) {
  (0, _invariant2.default)(isInputType(type), 'Expected ' + String(type) + ' to be a GraphQL input type.');
  return type;
}

/**
 * These types may be used as output types as the result of fields.
 */
function isOutputType(type) {
  return type instanceof GraphQLScalarType || type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType || type instanceof GraphQLEnumType || type instanceof GraphQLNonNull && isOutputType(type.ofType) || type instanceof GraphQLList && isOutputType(type.ofType);
}

function assertOutputType(type) {
  (0, _invariant2.default)(isOutputType(type), 'Expected ' + String(type) + ' to be a GraphQL output type.');
  return type;
}

/**
 * These types may describe types which may be leaf values.
 */
function isLeafType(type) {
  return type instanceof GraphQLScalarType || type instanceof GraphQLEnumType;
}

function assertLeafType(type) {
  (0, _invariant2.default)(isLeafType(type), 'Expected ' + String(type) + ' to be a GraphQL leaf type.');
  return type;
}

/**
 * These types may describe the parent context of a selection set.
 */
function isCompositeType(type) {
  return type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType;
}

function assertCompositeType(type) {
  (0, _invariant2.default)(isCompositeType(type), 'Expected ' + String(type) + ' to be a GraphQL composite type.');
  return type;
}

/**
 * These types may describe the parent context of a selection set.
 */
function isAbstractType(type) {
  return type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType;
}

function assertAbstractType(type) {
  (0, _invariant2.default)(isAbstractType(type), 'Expected ' + String(type) + ' to be a GraphQL abstract type.');
  return type;
}

/**
 * These types can all accept null as a value.
 */
function getNullableType(type) {
  return type instanceof GraphQLNonNull ? type.ofType : type;
}

/**
 * These named types do not include modifiers like List or NonNull.
 */
function isNamedType(type) {
  return type instanceof GraphQLScalarType || type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType || type instanceof GraphQLEnumType || type instanceof GraphQLInputObjectType;
}

function assertNamedType(type) {
  (0, _invariant2.default)(isNamedType(type), 'Expected ' + String(type) + ' to be a GraphQL named type.');
  return type;
}

/* eslint-disable no-redeclare */
function getNamedType(type) {
  /* eslint-enable no-redeclare */
  if (type) {
    var unmodifiedType = type;
    while (unmodifiedType instanceof GraphQLList || unmodifiedType instanceof GraphQLNonNull) {
      unmodifiedType = unmodifiedType.ofType;
    }
    return unmodifiedType;
  }
}

/**
 * Used while defining GraphQL types to allow for circular references in
 * otherwise immutable type definitions.
 */


function resolveThunk(thunk) {
  return typeof thunk === 'function' ? thunk() : thunk;
}

/**
 * Scalar Type Definition
 *
 * The leaf values of any request and input values to arguments are
 * Scalars (or Enums) and are defined with a name and a series of functions
 * used to parse input from ast or variables and to ensure validity.
 *
 * Example:
 *
 *     const OddType = new GraphQLScalarType({
 *       name: 'Odd',
 *       serialize(value) {
 *         return value % 2 === 1 ? value : null;
 *       }
 *     });
 *
 */

var GraphQLScalarType = exports.GraphQLScalarType = function () {
  function GraphQLScalarType(config) {
    _classCallCheck(this, GraphQLScalarType);

    (0, _assertValidName.assertValidName)(config.name);
    this.name = config.name;
    this.description = config.description;
    (0, _invariant2.default)(typeof config.serialize === 'function', this.name + ' must provide "serialize" function. If this custom Scalar ' + 'is also used as an input type, ensure "parseValue" and "parseLiteral" ' + 'functions are also provided.');
    if (config.parseValue || config.parseLiteral) {
      (0, _invariant2.default)(typeof config.parseValue === 'function' && typeof config.parseLiteral === 'function', this.name + ' must provide both "parseValue" and "parseLiteral" ' + 'functions.');
    }
    this._scalarConfig = config;
  }

  // Serializes an internal value to include in a response.


  GraphQLScalarType.prototype.serialize = function serialize(value) {
    var serializer = this._scalarConfig.serialize;
    return serializer(value);
  };

  // Determines if an internal value is valid for this type.
  // Equivalent to checking for if the parsedValue is nullish.


  GraphQLScalarType.prototype.isValidValue = function isValidValue(value) {
    return !(0, _isNullish2.default)(this.parseValue(value));
  };

  // Parses an externally provided value to use as an input.


  GraphQLScalarType.prototype.parseValue = function parseValue(value) {
    var parser = this._scalarConfig.parseValue;
    return parser && !(0, _isNullish2.default)(value) ? parser(value) : undefined;
  };

  // Determines if an internal value is valid for this type.
  // Equivalent to checking for if the parsedLiteral is nullish.


  GraphQLScalarType.prototype.isValidLiteral = function isValidLiteral(valueNode) {
    return !(0, _isNullish2.default)(this.parseLiteral(valueNode));
  };

  // Parses an externally provided literal value to use as an input.


  GraphQLScalarType.prototype.parseLiteral = function parseLiteral(valueNode) {
    var parser = this._scalarConfig.parseLiteral;
    return parser ? parser(valueNode) : undefined;
  };

  GraphQLScalarType.prototype.toString = function toString() {
    return this.name;
  };

  return GraphQLScalarType;
}();

// Also provide toJSON and inspect aliases for toString.


GraphQLScalarType.prototype.toJSON = GraphQLScalarType.prototype.inspect = GraphQLScalarType.prototype.toString;

/**
 * Object Type Definition
 *
 * Almost all of the GraphQL types you define will be object types. Object types
 * have a name, but most importantly describe their fields.
 *
 * Example:
 *
 *     const AddressType = new GraphQLObjectType({
 *       name: 'Address',
 *       fields: {
 *         street: { type: GraphQLString },
 *         number: { type: GraphQLInt },
 *         formatted: {
 *           type: GraphQLString,
 *           resolve(obj) {
 *             return obj.number + ' ' + obj.street
 *           }
 *         }
 *       }
 *     });
 *
 * When two types need to refer to each other, or a type needs to refer to
 * itself in a field, you can use a function expression (aka a closure or a
 * thunk) to supply the fields lazily.
 *
 * Example:
 *
 *     const PersonType = new GraphQLObjectType({
 *       name: 'Person',
 *       fields: () => ({
 *         name: { type: GraphQLString },
 *         bestFriend: { type: PersonType },
 *       })
 *     });
 *
 */
var GraphQLObjectType = exports.GraphQLObjectType = function () {
  function GraphQLObjectType(config) {
    _classCallCheck(this, GraphQLObjectType);

    (0, _assertValidName.assertValidName)(config.name, config.isIntrospection);
    this.name = config.name;
    this.description = config.description;
    if (config.isTypeOf) {
      (0, _invariant2.default)(typeof config.isTypeOf === 'function', this.name + ' must provide "isTypeOf" as a function.');
    }
    this.isTypeOf = config.isTypeOf;
    this._typeConfig = config;
  }

  GraphQLObjectType.prototype.getFields = function getFields() {
    return this._fields || (this._fields = defineFieldMap(this, this._typeConfig.fields));
  };

  GraphQLObjectType.prototype.getInterfaces = function getInterfaces() {
    return this._interfaces || (this._interfaces = defineInterfaces(this, this._typeConfig.interfaces));
  };

  GraphQLObjectType.prototype.toString = function toString() {
    return this.name;
  };

  return GraphQLObjectType;
}();

// Also provide toJSON and inspect aliases for toString.


GraphQLObjectType.prototype.toJSON = GraphQLObjectType.prototype.inspect = GraphQLObjectType.prototype.toString;

function defineInterfaces(type, interfacesThunk) {
  var interfaces = resolveThunk(interfacesThunk);
  if (!interfaces) {
    return [];
  }
  (0, _invariant2.default)(Array.isArray(interfaces), type.name + ' interfaces must be an Array or a function which returns ' + 'an Array.');

  var implementedTypeNames = Object.create(null);
  interfaces.forEach(function (iface) {
    (0, _invariant2.default)(iface instanceof GraphQLInterfaceType, type.name + ' may only implement Interface types, it cannot ' + ('implement: ' + String(iface) + '.'));
    (0, _invariant2.default)(!implementedTypeNames[iface.name], type.name + ' may declare it implements ' + iface.name + ' only once.');
    implementedTypeNames[iface.name] = true;
    if (typeof iface.resolveType !== 'function') {
      (0, _invariant2.default)(typeof type.isTypeOf === 'function', 'Interface Type ' + iface.name + ' does not provide a "resolveType" ' + ('function and implementing Type ' + type.name + ' does not provide a ') + '"isTypeOf" function. There is no way to resolve this implementing ' + 'type during execution.');
    }
  });
  return interfaces;
}

function defineFieldMap(type, fieldsThunk) {
  var fieldMap = resolveThunk(fieldsThunk);
  (0, _invariant2.default)(isPlainObj(fieldMap), type.name + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');

  var fieldNames = Object.keys(fieldMap);
  (0, _invariant2.default)(fieldNames.length > 0, type.name + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');

  var resultFieldMap = Object.create(null);
  fieldNames.forEach(function (fieldName) {
    (0, _assertValidName.assertValidName)(fieldName);
    var fieldConfig = fieldMap[fieldName];
    (0, _invariant2.default)(isPlainObj(fieldConfig), type.name + '.' + fieldName + ' field config must be an object');
    (0, _invariant2.default)(!fieldConfig.hasOwnProperty('isDeprecated'), type.name + '.' + fieldName + ' should provide "deprecationReason" instead ' + 'of "isDeprecated".');
    var field = _extends({}, fieldConfig, {
      isDeprecated: Boolean(fieldConfig.deprecationReason),
      name: fieldName
    });
    (0, _invariant2.default)(isOutputType(field.type), type.name + '.' + fieldName + ' field type must be Output Type but ' + ('got: ' + String(field.type) + '.'));
    (0, _invariant2.default)(isValidResolver(field.resolve), type.name + '.' + fieldName + ' field resolver must be a function if ' + ('provided, but got: ' + String(field.resolve) + '.'));
    var argsConfig = fieldConfig.args;
    if (!argsConfig) {
      field.args = [];
    } else {
      (0, _invariant2.default)(isPlainObj(argsConfig), type.name + '.' + fieldName + ' args must be an object with argument ' + 'names as keys.');
      field.args = Object.keys(argsConfig).map(function (argName) {
        (0, _assertValidName.assertValidName)(argName);
        var arg = argsConfig[argName];
        (0, _invariant2.default)(isInputType(arg.type), type.name + '.' + fieldName + '(' + argName + ':) argument type must be ' + ('Input Type but got: ' + String(arg.type) + '.'));
        return {
          name: argName,
          description: arg.description === undefined ? null : arg.description,
          type: arg.type,
          defaultValue: arg.defaultValue
        };
      });
    }
    resultFieldMap[fieldName] = field;
  });
  return resultFieldMap;
}

function isPlainObj(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

// If a resolver is defined, it must be a function.
function isValidResolver(resolver) {
  return resolver == null || typeof resolver === 'function';
}

/**
 * Interface Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Interface type
 * is used to describe what types are possible, what fields are in common across
 * all types, as well as a function to determine which type is actually used
 * when the field is resolved.
 *
 * Example:
 *
 *     const EntityType = new GraphQLInterfaceType({
 *       name: 'Entity',
 *       fields: {
 *         name: { type: GraphQLString }
 *       }
 *     });
 *
 */
var GraphQLInterfaceType = exports.GraphQLInterfaceType = function () {
  function GraphQLInterfaceType(config) {
    _classCallCheck(this, GraphQLInterfaceType);

    (0, _assertValidName.assertValidName)(config.name);
    this.name = config.name;
    this.description = config.description;
    if (config.resolveType) {
      (0, _invariant2.default)(typeof config.resolveType === 'function', this.name + ' must provide "resolveType" as a function.');
    }
    this.resolveType = config.resolveType;
    this._typeConfig = config;
  }

  GraphQLInterfaceType.prototype.getFields = function getFields() {
    return this._fields || (this._fields = defineFieldMap(this, this._typeConfig.fields));
  };

  GraphQLInterfaceType.prototype.toString = function toString() {
    return this.name;
  };

  return GraphQLInterfaceType;
}();

// Also provide toJSON and inspect aliases for toString.


GraphQLInterfaceType.prototype.toJSON = GraphQLInterfaceType.prototype.inspect = GraphQLInterfaceType.prototype.toString;

/**
 * Union Type Definition
 *
 * When a field can return one of a heterogeneous set of types, a Union type
 * is used to describe what types are possible as well as providing a function
 * to determine which type is actually used when the field is resolved.
 *
 * Example:
 *
 *     const PetType = new GraphQLUnionType({
 *       name: 'Pet',
 *       types: [ DogType, CatType ],
 *       resolveType(value) {
 *         if (value instanceof Dog) {
 *           return DogType;
 *         }
 *         if (value instanceof Cat) {
 *           return CatType;
 *         }
 *       }
 *     });
 *
 */
var GraphQLUnionType = exports.GraphQLUnionType = function () {
  function GraphQLUnionType(config) {
    _classCallCheck(this, GraphQLUnionType);

    (0, _assertValidName.assertValidName)(config.name);
    this.name = config.name;
    this.description = config.description;
    if (config.resolveType) {
      (0, _invariant2.default)(typeof config.resolveType === 'function', this.name + ' must provide "resolveType" as a function.');
    }
    this.resolveType = config.resolveType;
    this._typeConfig = config;
  }

  GraphQLUnionType.prototype.getTypes = function getTypes() {
    return this._types || (this._types = defineTypes(this, this._typeConfig.types));
  };

  GraphQLUnionType.prototype.toString = function toString() {
    return this.name;
  };

  return GraphQLUnionType;
}();

// Also provide toJSON and inspect aliases for toString.


GraphQLUnionType.prototype.toJSON = GraphQLUnionType.prototype.inspect = GraphQLUnionType.prototype.toString;

function defineTypes(unionType, typesThunk) {
  var types = resolveThunk(typesThunk);

  (0, _invariant2.default)(Array.isArray(types) && types.length > 0, 'Must provide Array of types or a function which returns ' + ('such an array for Union ' + unionType.name + '.'));
  var includedTypeNames = Object.create(null);
  types.forEach(function (objType) {
    (0, _invariant2.default)(objType instanceof GraphQLObjectType, unionType.name + ' may only contain Object types, it cannot contain: ' + (String(objType) + '.'));
    (0, _invariant2.default)(!includedTypeNames[objType.name], unionType.name + ' can include ' + objType.name + ' type only once.');
    includedTypeNames[objType.name] = true;
    if (typeof unionType.resolveType !== 'function') {
      (0, _invariant2.default)(typeof objType.isTypeOf === 'function', 'Union type "' + unionType.name + '" does not provide a "resolveType" ' + ('function and possible type "' + objType.name + '" does not provide an ') + '"isTypeOf" function. There is no way to resolve this possible type ' + 'during execution.');
    }
  });

  return types;
}

/**
 * Enum Type Definition
 *
 * Some leaf values of requests and input values are Enums. GraphQL serializes
 * Enum values as strings, however internally Enums can be represented by any
 * kind of type, often integers.
 *
 * Example:
 *
 *     const RGBType = new GraphQLEnumType({
 *       name: 'RGB',
 *       values: {
 *         RED: { value: 0 },
 *         GREEN: { value: 1 },
 *         BLUE: { value: 2 }
 *       }
 *     });
 *
 * Note: If a value is not provided in a definition, the name of the enum value
 * will be used as its internal value.
 */
var GraphQLEnumType /* <T> */ = exports.GraphQLEnumType = function () {
  function GraphQLEnumType(config /* <T> */) {
    _classCallCheck(this, GraphQLEnumType);

    this.name = config.name;
    (0, _assertValidName.assertValidName)(config.name, config.isIntrospection);
    this.description = config.description;
    this._values = defineEnumValues(this, config.values);
    this._enumConfig = config;
  }

  GraphQLEnumType.prototype.getValues = function getValues() {
    return this._values;
  };

  GraphQLEnumType.prototype.getValue = function getValue(name) {
    return this._getNameLookup()[name];
  };

  GraphQLEnumType.prototype.serialize = function serialize(value /* T */) {
    var enumValue = this._getValueLookup().get(value);
    return enumValue ? enumValue.name : null;
  };

  GraphQLEnumType.prototype.isValidValue = function isValidValue(value) {
    return typeof value === 'string' && this._getNameLookup()[value] !== undefined;
  };

  GraphQLEnumType.prototype.parseValue = function parseValue(value) /* T */{
    if (typeof value === 'string') {
      var enumValue = this._getNameLookup()[value];
      if (enumValue) {
        return enumValue.value;
      }
    }
  };

  GraphQLEnumType.prototype.isValidLiteral = function isValidLiteral(valueNode) {
    return valueNode.kind === Kind.ENUM && this._getNameLookup()[valueNode.value] !== undefined;
  };

  GraphQLEnumType.prototype.parseLiteral = function parseLiteral(valueNode) /* T */{
    if (valueNode.kind === Kind.ENUM) {
      var enumValue = this._getNameLookup()[valueNode.value];
      if (enumValue) {
        return enumValue.value;
      }
    }
  };

  GraphQLEnumType.prototype._getValueLookup = function _getValueLookup() {
    if (!this._valueLookup) {
      var lookup = new Map();
      this.getValues().forEach(function (value) {
        lookup.set(value.value, value);
      });
      this._valueLookup = lookup;
    }
    return this._valueLookup;
  };

  GraphQLEnumType.prototype._getNameLookup = function _getNameLookup() {
    if (!this._nameLookup) {
      var lookup = Object.create(null);
      this.getValues().forEach(function (value) {
        lookup[value.name] = value;
      });
      this._nameLookup = lookup;
    }
    return this._nameLookup;
  };

  GraphQLEnumType.prototype.toString = function toString() {
    return this.name;
  };

  return GraphQLEnumType;
}();

// Also provide toJSON and inspect aliases for toString.


GraphQLEnumType.prototype.toJSON = GraphQLEnumType.prototype.inspect = GraphQLEnumType.prototype.toString;

function defineEnumValues(type, valueMap /* <T> */
) {
  (0, _invariant2.default)(isPlainObj(valueMap), type.name + ' values must be an object with value names as keys.');
  var valueNames = Object.keys(valueMap);
  (0, _invariant2.default)(valueNames.length > 0, type.name + ' values must be an object with value names as keys.');
  return valueNames.map(function (valueName) {
    (0, _assertValidName.assertValidName)(valueName);
    (0, _invariant2.default)(['true', 'false', 'null'].indexOf(valueName) === -1, 'Name "' + valueName + '" can not be used as an Enum value.');

    var value = valueMap[valueName];
    (0, _invariant2.default)(isPlainObj(value), type.name + '.' + valueName + ' must refer to an object with a "value" key ' + ('representing an internal value but got: ' + String(value) + '.'));
    (0, _invariant2.default)(!value.hasOwnProperty('isDeprecated'), type.name + '.' + valueName + ' should provide "deprecationReason" instead ' + 'of "isDeprecated".');
    return {
      name: valueName,
      description: value.description,
      isDeprecated: Boolean(value.deprecationReason),
      deprecationReason: value.deprecationReason,
      value: value.hasOwnProperty('value') ? value.value : valueName
    };
  });
} /* <T> */


/**
 * Input Object Type Definition
 *
 * An input object defines a structured collection of fields which may be
 * supplied to a field argument.
 *
 * Using `NonNull` will ensure that a value must be provided by the query
 *
 * Example:
 *
 *     const GeoPoint = new GraphQLInputObjectType({
 *       name: 'GeoPoint',
 *       fields: {
 *         lat: { type: new GraphQLNonNull(GraphQLFloat) },
 *         lon: { type: new GraphQLNonNull(GraphQLFloat) },
 *         alt: { type: GraphQLFloat, defaultValue: 0 },
 *       }
 *     });
 *
 */
var GraphQLInputObjectType = exports.GraphQLInputObjectType = function () {
  function GraphQLInputObjectType(config) {
    _classCallCheck(this, GraphQLInputObjectType);

    (0, _assertValidName.assertValidName)(config.name);
    this.name = config.name;
    this.description = config.description;
    this._typeConfig = config;
  }

  GraphQLInputObjectType.prototype.getFields = function getFields() {
    return this._fields || (this._fields = this._defineFieldMap());
  };

  GraphQLInputObjectType.prototype._defineFieldMap = function _defineFieldMap() {
    var _this = this;

    var fieldMap = resolveThunk(this._typeConfig.fields);
    (0, _invariant2.default)(isPlainObj(fieldMap), this.name + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');
    var fieldNames = Object.keys(fieldMap);
    (0, _invariant2.default)(fieldNames.length > 0, this.name + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');
    var resultFieldMap = Object.create(null);
    fieldNames.forEach(function (fieldName) {
      (0, _assertValidName.assertValidName)(fieldName);
      var field = _extends({}, fieldMap[fieldName], {
        name: fieldName
      });
      (0, _invariant2.default)(isInputType(field.type), _this.name + '.' + fieldName + ' field type must be Input Type but ' + ('got: ' + String(field.type) + '.'));
      (0, _invariant2.default)(field.resolve == null, _this.name + '.' + fieldName + ' field type has a resolve property, but ' + 'Input Types cannot define resolvers.');
      resultFieldMap[fieldName] = field;
    });
    return resultFieldMap;
  };

  GraphQLInputObjectType.prototype.toString = function toString() {
    return this.name;
  };

  return GraphQLInputObjectType;
}();

// Also provide toJSON and inspect aliases for toString.


GraphQLInputObjectType.prototype.toJSON = GraphQLInputObjectType.prototype.inspect = GraphQLInputObjectType.prototype.toString;

/**
 * List Modifier
 *
 * A list is a kind of type marker, a wrapping type which points to another
 * type. Lists are often created within the context of defining the fields of
 * an object type.
 *
 * Example:
 *
 *     const PersonType = new GraphQLObjectType({
 *       name: 'Person',
 *       fields: () => ({
 *         parents: { type: new GraphQLList(Person) },
 *         children: { type: new GraphQLList(Person) },
 *       })
 *     })
 *
 */
var GraphQLList = exports.GraphQLList = function () {
  function GraphQLList(type) {
    _classCallCheck(this, GraphQLList);

    (0, _invariant2.default)(isType(type), 'Can only create List of a GraphQLType but got: ' + String(type) + '.');
    this.ofType = type;
  }

  GraphQLList.prototype.toString = function toString() {
    return '[' + String(this.ofType) + ']';
  };

  return GraphQLList;
}();

// Also provide toJSON and inspect aliases for toString.


GraphQLList.prototype.toJSON = GraphQLList.prototype.inspect = GraphQLList.prototype.toString;

/**
 * Non-Null Modifier
 *
 * A non-null is a kind of type marker, a wrapping type which points to another
 * type. Non-null types enforce that their values are never null and can ensure
 * an error is raised if this ever occurs during a request. It is useful for
 * fields which you can make a strong guarantee on non-nullability, for example
 * usually the id field of a database row will never be null.
 *
 * Example:
 *
 *     const RowType = new GraphQLObjectType({
 *       name: 'Row',
 *       fields: () => ({
 *         id: { type: new GraphQLNonNull(GraphQLString) },
 *       })
 *     })
 *
 * Note: the enforcement of non-nullability occurs within the executor.
 */

var GraphQLNonNull = exports.GraphQLNonNull = function () {
  function GraphQLNonNull(type) {
    _classCallCheck(this, GraphQLNonNull);

    (0, _invariant2.default)(isType(type) && !(type instanceof GraphQLNonNull), 'Can only create NonNull of a Nullable GraphQLType but got: ' + (String(type) + '.'));
    this.ofType = type;
  }

  GraphQLNonNull.prototype.toString = function toString() {
    return this.ofType.toString() + '!';
  };

  return GraphQLNonNull;
}();

// Also provide toJSON and inspect aliases for toString.


GraphQLNonNull.prototype.toJSON = GraphQLNonNull.prototype.inspect = GraphQLNonNull.prototype.toString;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Name

var NAME = exports.NAME = 'Name';

// Document

var DOCUMENT = exports.DOCUMENT = 'Document';
var OPERATION_DEFINITION = exports.OPERATION_DEFINITION = 'OperationDefinition';
var VARIABLE_DEFINITION = exports.VARIABLE_DEFINITION = 'VariableDefinition';
var VARIABLE = exports.VARIABLE = 'Variable';
var SELECTION_SET = exports.SELECTION_SET = 'SelectionSet';
var FIELD = exports.FIELD = 'Field';
var ARGUMENT = exports.ARGUMENT = 'Argument';

// Fragments

var FRAGMENT_SPREAD = exports.FRAGMENT_SPREAD = 'FragmentSpread';
var INLINE_FRAGMENT = exports.INLINE_FRAGMENT = 'InlineFragment';
var FRAGMENT_DEFINITION = exports.FRAGMENT_DEFINITION = 'FragmentDefinition';

// Values

var INT = exports.INT = 'IntValue';
var FLOAT = exports.FLOAT = 'FloatValue';
var STRING = exports.STRING = 'StringValue';
var BOOLEAN = exports.BOOLEAN = 'BooleanValue';
var NULL = exports.NULL = 'NullValue';
var ENUM = exports.ENUM = 'EnumValue';
var LIST = exports.LIST = 'ListValue';
var OBJECT = exports.OBJECT = 'ObjectValue';
var OBJECT_FIELD = exports.OBJECT_FIELD = 'ObjectField';

// Directives

var DIRECTIVE = exports.DIRECTIVE = 'Directive';

// Types

var NAMED_TYPE = exports.NAMED_TYPE = 'NamedType';
var LIST_TYPE = exports.LIST_TYPE = 'ListType';
var NON_NULL_TYPE = exports.NON_NULL_TYPE = 'NonNullType';

// Type System Definitions

var SCHEMA_DEFINITION = exports.SCHEMA_DEFINITION = 'SchemaDefinition';
var OPERATION_TYPE_DEFINITION = exports.OPERATION_TYPE_DEFINITION = 'OperationTypeDefinition';

// Type Definitions

var SCALAR_TYPE_DEFINITION = exports.SCALAR_TYPE_DEFINITION = 'ScalarTypeDefinition';
var OBJECT_TYPE_DEFINITION = exports.OBJECT_TYPE_DEFINITION = 'ObjectTypeDefinition';
var FIELD_DEFINITION = exports.FIELD_DEFINITION = 'FieldDefinition';
var INPUT_VALUE_DEFINITION = exports.INPUT_VALUE_DEFINITION = 'InputValueDefinition';
var INTERFACE_TYPE_DEFINITION = exports.INTERFACE_TYPE_DEFINITION = 'InterfaceTypeDefinition';
var UNION_TYPE_DEFINITION = exports.UNION_TYPE_DEFINITION = 'UnionTypeDefinition';
var ENUM_TYPE_DEFINITION = exports.ENUM_TYPE_DEFINITION = 'EnumTypeDefinition';
var ENUM_VALUE_DEFINITION = exports.ENUM_VALUE_DEFINITION = 'EnumValueDefinition';
var INPUT_OBJECT_TYPE_DEFINITION = exports.INPUT_OBJECT_TYPE_DEFINITION = 'InputObjectTypeDefinition';

// Type Extensions

var TYPE_EXTENSION_DEFINITION = exports.TYPE_EXTENSION_DEFINITION = 'TypeExtensionDefinition';

// Directive Definitions

var DIRECTIVE_DEFINITION = exports.DIRECTIVE_DEFINITION = 'DirectiveDefinition';

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = invariant;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(72);
var isBuffer = __webpack_require__(182);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(62)('wks')
  , uid        = __webpack_require__(63)
  , Symbol     = __webpack_require__(6).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.print = print;

var _visitor = __webpack_require__(26);

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
function print(ast) {
  return (0, _visitor.visit)(ast, { leave: printDocASTReducer });
} /**
   *  Copyright (c) 2015, Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree. An additional grant
   *  of patent rights can be found in the PATENTS file in the same directory.
   */

var printDocASTReducer = {
  Name: function Name(node) {
    return node.value;
  },
  Variable: function Variable(node) {
    return '$' + node.name;
  },

  // Document

  Document: function Document(node) {
    return join(node.definitions, '\n\n') + '\n';
  },

  OperationDefinition: function OperationDefinition(node) {
    var op = node.operation;
    var name = node.name;
    var varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
    var directives = join(node.directives, ' ');
    var selectionSet = node.selectionSet;
    // Anonymous queries with no directives or variable definitions can use
    // the query short form.
    return !name && !directives && !varDefs && op === 'query' ? selectionSet : join([op, join([name, varDefs]), directives, selectionSet], ' ');
  },


  VariableDefinition: function VariableDefinition(_ref) {
    var variable = _ref.variable,
        type = _ref.type,
        defaultValue = _ref.defaultValue;
    return variable + ': ' + type + wrap(' = ', defaultValue);
  },

  SelectionSet: function SelectionSet(_ref2) {
    var selections = _ref2.selections;
    return block(selections);
  },

  Field: function Field(_ref3) {
    var alias = _ref3.alias,
        name = _ref3.name,
        args = _ref3.arguments,
        directives = _ref3.directives,
        selectionSet = _ref3.selectionSet;
    return join([wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'), join(directives, ' '), selectionSet], ' ');
  },

  Argument: function Argument(_ref4) {
    var name = _ref4.name,
        value = _ref4.value;
    return name + ': ' + value;
  },

  // Fragments

  FragmentSpread: function FragmentSpread(_ref5) {
    var name = _ref5.name,
        directives = _ref5.directives;
    return '...' + name + wrap(' ', join(directives, ' '));
  },

  InlineFragment: function InlineFragment(_ref6) {
    var typeCondition = _ref6.typeCondition,
        directives = _ref6.directives,
        selectionSet = _ref6.selectionSet;
    return join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' ');
  },

  FragmentDefinition: function FragmentDefinition(_ref7) {
    var name = _ref7.name,
        typeCondition = _ref7.typeCondition,
        directives = _ref7.directives,
        selectionSet = _ref7.selectionSet;
    return 'fragment ' + name + ' on ' + typeCondition + ' ' + wrap('', join(directives, ' '), ' ') + selectionSet;
  },

  // Value

  IntValue: function IntValue(_ref8) {
    var value = _ref8.value;
    return value;
  },
  FloatValue: function FloatValue(_ref9) {
    var value = _ref9.value;
    return value;
  },
  StringValue: function StringValue(_ref10) {
    var value = _ref10.value;
    return JSON.stringify(value);
  },
  BooleanValue: function BooleanValue(_ref11) {
    var value = _ref11.value;
    return JSON.stringify(value);
  },
  NullValue: function NullValue() {
    return 'null';
  },
  EnumValue: function EnumValue(_ref12) {
    var value = _ref12.value;
    return value;
  },
  ListValue: function ListValue(_ref13) {
    var values = _ref13.values;
    return '[' + join(values, ', ') + ']';
  },
  ObjectValue: function ObjectValue(_ref14) {
    var fields = _ref14.fields;
    return '{' + join(fields, ', ') + '}';
  },
  ObjectField: function ObjectField(_ref15) {
    var name = _ref15.name,
        value = _ref15.value;
    return name + ': ' + value;
  },

  // Directive

  Directive: function Directive(_ref16) {
    var name = _ref16.name,
        args = _ref16.arguments;
    return '@' + name + wrap('(', join(args, ', '), ')');
  },

  // Type

  NamedType: function NamedType(_ref17) {
    var name = _ref17.name;
    return name;
  },
  ListType: function ListType(_ref18) {
    var type = _ref18.type;
    return '[' + type + ']';
  },
  NonNullType: function NonNullType(_ref19) {
    var type = _ref19.type;
    return type + '!';
  },

  // Type System Definitions

  SchemaDefinition: function SchemaDefinition(_ref20) {
    var directives = _ref20.directives,
        operationTypes = _ref20.operationTypes;
    return join(['schema', join(directives, ' '), block(operationTypes)], ' ');
  },

  OperationTypeDefinition: function OperationTypeDefinition(_ref21) {
    var operation = _ref21.operation,
        type = _ref21.type;
    return operation + ': ' + type;
  },

  ScalarTypeDefinition: function ScalarTypeDefinition(_ref22) {
    var name = _ref22.name,
        directives = _ref22.directives;
    return join(['scalar', name, join(directives, ' ')], ' ');
  },

  ObjectTypeDefinition: function ObjectTypeDefinition(_ref23) {
    var name = _ref23.name,
        interfaces = _ref23.interfaces,
        directives = _ref23.directives,
        fields = _ref23.fields;
    return join(['type', name, wrap('implements ', join(interfaces, ', ')), join(directives, ' '), block(fields)], ' ');
  },

  FieldDefinition: function FieldDefinition(_ref24) {
    var name = _ref24.name,
        args = _ref24.arguments,
        type = _ref24.type,
        directives = _ref24.directives;
    return name + wrap('(', join(args, ', '), ')') + ': ' + type + wrap(' ', join(directives, ' '));
  },

  InputValueDefinition: function InputValueDefinition(_ref25) {
    var name = _ref25.name,
        type = _ref25.type,
        defaultValue = _ref25.defaultValue,
        directives = _ref25.directives;
    return join([name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')], ' ');
  },

  InterfaceTypeDefinition: function InterfaceTypeDefinition(_ref26) {
    var name = _ref26.name,
        directives = _ref26.directives,
        fields = _ref26.fields;
    return join(['interface', name, join(directives, ' '), block(fields)], ' ');
  },

  UnionTypeDefinition: function UnionTypeDefinition(_ref27) {
    var name = _ref27.name,
        directives = _ref27.directives,
        types = _ref27.types;
    return join(['union', name, join(directives, ' '), '= ' + join(types, ' | ')], ' ');
  },

  EnumTypeDefinition: function EnumTypeDefinition(_ref28) {
    var name = _ref28.name,
        directives = _ref28.directives,
        values = _ref28.values;
    return join(['enum', name, join(directives, ' '), block(values)], ' ');
  },

  EnumValueDefinition: function EnumValueDefinition(_ref29) {
    var name = _ref29.name,
        directives = _ref29.directives;
    return join([name, join(directives, ' ')], ' ');
  },

  InputObjectTypeDefinition: function InputObjectTypeDefinition(_ref30) {
    var name = _ref30.name,
        directives = _ref30.directives,
        fields = _ref30.fields;
    return join(['input', name, join(directives, ' '), block(fields)], ' ');
  },

  TypeExtensionDefinition: function TypeExtensionDefinition(_ref31) {
    var definition = _ref31.definition;
    return 'extend ' + definition;
  },

  DirectiveDefinition: function DirectiveDefinition(_ref32) {
    var name = _ref32.name,
        args = _ref32.arguments,
        locations = _ref32.locations;
    return 'directive @' + name + wrap('(', join(args, ', '), ')') + ' on ' + join(locations, ' | ');
  }
};

/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join(maybeArray, separator) {
  return maybeArray ? maybeArray.filter(function (x) {
    return x;
  }).join(separator || '') : '';
}

/**
 * Given array, print each item on its own line, wrapped in an
 * indented "{ }" block.
 */
function block(array) {
  return array && array.length !== 0 ? indent('{\n' + join(array, '\n')) + '\n}' : '{}';
}

/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap(start, maybeString, end) {
  return maybeString ? start + maybeString + (end || '') : '';
}

function indent(maybeString) {
  return maybeString && maybeString.replace(/\n/g, '\n  ');
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNLE1BQU0sR0FBRztBQUNiLEtBQUcsRUFBRSxPQUFPO0FBQ1osS0FBRyxFQUFFLE1BQU07QUFDWCxLQUFHLEVBQUUsTUFBTTtBQUNYLEtBQUcsRUFBRSxRQUFRO0FBQ2IsS0FBRyxFQUFFLFFBQVE7QUFDYixLQUFHLEVBQUUsUUFBUTtBQUNiLEtBQUcsRUFBRSxRQUFRO0NBQ2QsQ0FBQzs7QUFFRixJQUFNLFFBQVEsR0FBRyxZQUFZO0lBQ3ZCLFFBQVEsR0FBRyxXQUFXLENBQUM7O0FBRTdCLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUN2QixTQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNwQjs7QUFFTSxTQUFTLE1BQU0sQ0FBQyxHQUFHLG9CQUFtQjtBQUMzQyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxTQUFLLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixVQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDM0QsV0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUM5QjtLQUNGO0dBQ0Y7O0FBRUQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7QUFFTSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzs7Ozs7O0FBS2hELElBQUksVUFBVSxHQUFHLG9CQUFTLEtBQUssRUFBRTtBQUMvQixTQUFPLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQztDQUNwQyxDQUFDOzs7QUFHRixJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNuQixVQUlNLFVBQVUsR0FKaEIsVUFBVSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQzNCLFdBQU8sT0FBTyxLQUFLLEtBQUssVUFBVSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssbUJBQW1CLENBQUM7R0FDcEYsQ0FBQztDQUNIO1FBQ08sVUFBVSxHQUFWLFVBQVU7Ozs7O0FBSVgsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxVQUFTLEtBQUssRUFBRTtBQUN0RCxTQUFPLEFBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsR0FBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGdCQUFnQixHQUFHLEtBQUssQ0FBQztDQUNqRyxDQUFDOzs7OztBQUdLLFNBQVMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDcEMsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoRCxRQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDdEIsYUFBTyxDQUFDLENBQUM7S0FDVjtHQUNGO0FBQ0QsU0FBTyxDQUFDLENBQUMsQ0FBQztDQUNYOztBQUdNLFNBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0FBQ3ZDLE1BQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFOztBQUU5QixRQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQzNCLGFBQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3hCLE1BQU0sSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ3pCLGFBQU8sRUFBRSxDQUFDO0tBQ1gsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2xCLGFBQU8sTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7Ozs7QUFLRCxVQUFNLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztHQUN0Qjs7QUFFRCxNQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUFFLFdBQU8sTUFBTSxDQUFDO0dBQUU7QUFDOUMsU0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUM3Qzs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLFdBQU8sSUFBSSxDQUFDO0dBQ2IsTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMvQyxXQUFPLElBQUksQ0FBQztHQUNiLE1BQU07QUFDTCxXQUFPLEtBQUssQ0FBQztHQUNkO0NBQ0Y7O0FBRU0sU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ2xDLE1BQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0IsT0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdkIsU0FBTyxLQUFLLENBQUM7Q0FDZDs7QUFFTSxTQUFTLFdBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ3ZDLFFBQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFNBQU8sTUFBTSxDQUFDO0NBQ2Y7O0FBRU0sU0FBUyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxFQUFFO0FBQ2pELFNBQU8sQ0FBQyxXQUFXLEdBQUcsV0FBVyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUEsR0FBSSxFQUFFLENBQUM7Q0FDcEQiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBlc2NhcGUgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmI3gyNzsnLFxuICAnYCc6ICcmI3g2MDsnLFxuICAnPSc6ICcmI3gzRDsnXG59O1xuXG5jb25zdCBiYWRDaGFycyA9IC9bJjw+XCInYD1dL2csXG4gICAgICBwb3NzaWJsZSA9IC9bJjw+XCInYD1dLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKG9iai8qICwgLi4uc291cmNlICovKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFyZ3VtZW50c1tpXSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcmd1bWVudHNbaV0sIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnQgbGV0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1zdHlsZSAqL1xubGV0IGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbmV4cG9ydCB7aXNGdW5jdGlvbn07XG4vKiBlc2xpbnQtZW5hYmxlIGZ1bmMtc3R5bGUgKi9cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5cbi8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICAgIGlmIChzdHJpbmcgJiYgc3RyaW5nLnRvSFRNTCkge1xuICAgICAgcmV0dXJuIHN0cmluZy50b0hUTUwoKTtcbiAgICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nICsgJyc7XG4gICAgfVxuXG4gICAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gICAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gICAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG4gIH1cblxuICBpZiAoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9iamVjdCkge1xuICBsZXQgZnJhbWUgPSBleHRlbmQoe30sIG9iamVjdCk7XG4gIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG4gIHJldHVybiBmcmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NrUGFyYW1zKHBhcmFtcywgaWRzKSB7XG4gIHBhcmFtcy5wYXRoID0gaWRzO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG4gIHJldHVybiAoY29udGV4dFBhdGggPyBjb250ZXh0UGF0aCArICcuJyA6ICcnKSArIGlkO1xufVxuIl19


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQLSchema = undefined;

var _definition = __webpack_require__(1);

var _directives = __webpack_require__(10);

var _introspection = __webpack_require__(15);

var _find = __webpack_require__(20);

var _find2 = _interopRequireDefault(_find);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _typeComparators = __webpack_require__(35);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Schema Definition
 *
 * A Schema is created by supplying the root types of each type of operation,
 * query and mutation (optional). A schema definition is then supplied to the
 * validator and executor.
 *
 * Example:
 *
 *     const MyAppSchema = new GraphQLSchema({
 *       query: MyAppQueryRootType,
 *       mutation: MyAppMutationRootType,
 *     })
 *
 * Note: If an array of `directives` are provided to GraphQLSchema, that will be
 * the exact list of directives represented and allowed. If `directives` is not
 * provided then a default set of the specified directives (e.g. @include and
 * @skip) will be used. If you wish to provide *additional* directives to these
 * specified directives, you must explicitly declare them. Example:
 *
 *     const MyAppSchema = new GraphQLSchema({
 *       ...
 *       directives: specifiedDirectives.concat([ myCustomDirective ]),
 *     })
 *
 */
var GraphQLSchema = exports.GraphQLSchema = function () {
  function GraphQLSchema(config) {
    var _this = this;

    _classCallCheck(this, GraphQLSchema);

    (0, _invariant2.default)(typeof config === 'object', 'Must provide configuration object.');

    (0, _invariant2.default)(config.query instanceof _definition.GraphQLObjectType, 'Schema query must be Object Type but got: ' + String(config.query) + '.');
    this._queryType = config.query;

    (0, _invariant2.default)(!config.mutation || config.mutation instanceof _definition.GraphQLObjectType, 'Schema mutation must be Object Type if provided but got: ' + String(config.mutation) + '.');
    this._mutationType = config.mutation;

    (0, _invariant2.default)(!config.subscription || config.subscription instanceof _definition.GraphQLObjectType, 'Schema subscription must be Object Type if provided but got: ' + String(config.subscription) + '.');
    this._subscriptionType = config.subscription;

    (0, _invariant2.default)(!config.types || Array.isArray(config.types), 'Schema types must be Array if provided but got: ' + String(config.types) + '.');

    (0, _invariant2.default)(!config.directives || Array.isArray(config.directives) && config.directives.every(function (directive) {
      return directive instanceof _directives.GraphQLDirective;
    }), 'Schema directives must be Array<GraphQLDirective> if provided but got: ' + String(config.directives) + '.');
    // Provide specified directives (e.g. @include and @skip) by default.
    this._directives = config.directives || _directives.specifiedDirectives;

    // Build type map now to detect any errors within this schema.
    var initialTypes = [this.getQueryType(), this.getMutationType(), this.getSubscriptionType(), _introspection.__Schema];

    var types = config.types;
    if (types) {
      initialTypes = initialTypes.concat(types);
    }

    this._typeMap = initialTypes.reduce(typeMapReducer, Object.create(null));

    // Keep track of all implementations by interface name.
    this._implementations = Object.create(null);
    Object.keys(this._typeMap).forEach(function (typeName) {
      var type = _this._typeMap[typeName];
      if (type instanceof _definition.GraphQLObjectType) {
        type.getInterfaces().forEach(function (iface) {
          var impls = _this._implementations[iface.name];
          if (impls) {
            impls.push(type);
          } else {
            _this._implementations[iface.name] = [type];
          }
        });
      }
    });

    // Enforce correct interface implementations.
    Object.keys(this._typeMap).forEach(function (typeName) {
      var type = _this._typeMap[typeName];
      if (type instanceof _definition.GraphQLObjectType) {
        type.getInterfaces().forEach(function (iface) {
          return assertObjectImplementsInterface(_this, type, iface);
        });
      }
    });
  }

  GraphQLSchema.prototype.getQueryType = function getQueryType() {
    return this._queryType;
  };

  GraphQLSchema.prototype.getMutationType = function getMutationType() {
    return this._mutationType;
  };

  GraphQLSchema.prototype.getSubscriptionType = function getSubscriptionType() {
    return this._subscriptionType;
  };

  GraphQLSchema.prototype.getTypeMap = function getTypeMap() {
    return this._typeMap;
  };

  GraphQLSchema.prototype.getType = function getType(name) {
    return this.getTypeMap()[name];
  };

  GraphQLSchema.prototype.getPossibleTypes = function getPossibleTypes(abstractType) {
    if (abstractType instanceof _definition.GraphQLUnionType) {
      return abstractType.getTypes();
    }
    (0, _invariant2.default)(abstractType instanceof _definition.GraphQLInterfaceType);
    return this._implementations[abstractType.name];
  };

  GraphQLSchema.prototype.isPossibleType = function isPossibleType(abstractType, possibleType) {
    var possibleTypeMap = this._possibleTypeMap;
    if (!possibleTypeMap) {
      this._possibleTypeMap = possibleTypeMap = Object.create(null);
    }

    if (!possibleTypeMap[abstractType.name]) {
      var possibleTypes = this.getPossibleTypes(abstractType);
      (0, _invariant2.default)(Array.isArray(possibleTypes), 'Could not find possible implementing types for ' + abstractType.name + ' ' + 'in schema. Check that schema.types is defined and is an array of ' + 'all possible types in the schema.');
      possibleTypeMap[abstractType.name] = possibleTypes.reduce(function (map, type) {
        return map[type.name] = true, map;
      }, Object.create(null));
    }

    return Boolean(possibleTypeMap[abstractType.name][possibleType.name]);
  };

  GraphQLSchema.prototype.getDirectives = function getDirectives() {
    return this._directives;
  };

  GraphQLSchema.prototype.getDirective = function getDirective(name) {
    return (0, _find2.default)(this.getDirectives(), function (directive) {
      return directive.name === name;
    });
  };

  return GraphQLSchema;
}();

function typeMapReducer(map, type) {
  if (!type) {
    return map;
  }
  if (type instanceof _definition.GraphQLList || type instanceof _definition.GraphQLNonNull) {
    return typeMapReducer(map, type.ofType);
  }
  if (map[type.name]) {
    (0, _invariant2.default)(map[type.name] === type, 'Schema must contain unique named types but contains multiple ' + ('types named "' + type.name + '".'));
    return map;
  }
  map[type.name] = type;

  var reducedMap = map;

  if (type instanceof _definition.GraphQLUnionType) {
    reducedMap = type.getTypes().reduce(typeMapReducer, reducedMap);
  }

  if (type instanceof _definition.GraphQLObjectType) {
    reducedMap = type.getInterfaces().reduce(typeMapReducer, reducedMap);
  }

  if (type instanceof _definition.GraphQLObjectType || type instanceof _definition.GraphQLInterfaceType) {
    var fieldMap = type.getFields();
    Object.keys(fieldMap).forEach(function (fieldName) {
      var field = fieldMap[fieldName];

      if (field.args) {
        var fieldArgTypes = field.args.map(function (arg) {
          return arg.type;
        });
        reducedMap = fieldArgTypes.reduce(typeMapReducer, reducedMap);
      }
      reducedMap = typeMapReducer(reducedMap, field.type);
    });
  }

  if (type instanceof _definition.GraphQLInputObjectType) {
    var _fieldMap = type.getFields();
    Object.keys(_fieldMap).forEach(function (fieldName) {
      var field = _fieldMap[fieldName];
      reducedMap = typeMapReducer(reducedMap, field.type);
    });
  }

  return reducedMap;
}

function assertObjectImplementsInterface(schema, object, iface) {
  var objectFieldMap = object.getFields();
  var ifaceFieldMap = iface.getFields();

  // Assert each interface field is implemented.
  Object.keys(ifaceFieldMap).forEach(function (fieldName) {
    var objectField = objectFieldMap[fieldName];
    var ifaceField = ifaceFieldMap[fieldName];

    // Assert interface field exists on object.
    (0, _invariant2.default)(objectField, '"' + iface.name + '" expects field "' + fieldName + '" but "' + object.name + '" ' + 'does not provide it.');

    // Assert interface field type is satisfied by object field type, by being
    // a valid subtype. (covariant)
    (0, _invariant2.default)((0, _typeComparators.isTypeSubTypeOf)(schema, objectField.type, ifaceField.type), iface.name + '.' + fieldName + ' expects type "' + String(ifaceField.type) + '" ' + 'but ' + (object.name + '.' + fieldName + ' provides type "' + String(objectField.type) + '".'));

    // Assert each interface field arg is implemented.
    ifaceField.args.forEach(function (ifaceArg) {
      var argName = ifaceArg.name;
      var objectArg = (0, _find2.default)(objectField.args, function (arg) {
        return arg.name === argName;
      });

      // Assert interface field arg exists on object field.
      (0, _invariant2.default)(objectArg, iface.name + '.' + fieldName + ' expects argument "' + argName + '" but ' + (object.name + '.' + fieldName + ' does not provide it.'));

      // Assert interface field arg type matches object field arg type.
      // (invariant)
      (0, _invariant2.default)((0, _typeComparators.isEqualType)(ifaceArg.type, objectArg.type), iface.name + '.' + fieldName + '(' + argName + ':) expects type ' + ('"' + String(ifaceArg.type) + '" but ') + (object.name + '.' + fieldName + '(' + argName + ':) provides type ') + ('"' + String(objectArg.type) + '".'));
    });

    // Assert additional arguments must not be required.
    objectField.args.forEach(function (objectArg) {
      var argName = objectArg.name;
      var ifaceArg = (0, _find2.default)(ifaceField.args, function (arg) {
        return arg.name === argName;
      });
      if (!ifaceArg) {
        (0, _invariant2.default)(!(objectArg.type instanceof _definition.GraphQLNonNull), object.name + '.' + fieldName + '(' + argName + ':) is of required type ' + ('"' + String(objectArg.type) + '" but is not also provided by the ') + ('interface ' + iface.name + '.' + fieldName + '.'));
      }
    });
  });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specifiedDirectives = exports.GraphQLDeprecatedDirective = exports.DEFAULT_DEPRECATION_REASON = exports.GraphQLSkipDirective = exports.GraphQLIncludeDirective = exports.GraphQLDirective = exports.DirectiveLocation = undefined;

var _definition = __webpack_require__(1);

var _scalars = __webpack_require__(12);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _assertValidName = __webpack_require__(50);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var DirectiveLocation = exports.DirectiveLocation = {
  // Operations
  QUERY: 'QUERY',
  MUTATION: 'MUTATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  FIELD: 'FIELD',
  FRAGMENT_DEFINITION: 'FRAGMENT_DEFINITION',
  FRAGMENT_SPREAD: 'FRAGMENT_SPREAD',
  INLINE_FRAGMENT: 'INLINE_FRAGMENT',
  // Schema Definitions
  SCHEMA: 'SCHEMA',
  SCALAR: 'SCALAR',
  OBJECT: 'OBJECT',
  FIELD_DEFINITION: 'FIELD_DEFINITION',
  ARGUMENT_DEFINITION: 'ARGUMENT_DEFINITION',
  INTERFACE: 'INTERFACE',
  UNION: 'UNION',
  ENUM: 'ENUM',
  ENUM_VALUE: 'ENUM_VALUE',
  INPUT_OBJECT: 'INPUT_OBJECT',
  INPUT_FIELD_DEFINITION: 'INPUT_FIELD_DEFINITION'
};

// eslint-disable-line

/**
 * Directives are used by the GraphQL runtime as a way of modifying execution
 * behavior. Type system creators will usually not create these directly.
 */
var GraphQLDirective = exports.GraphQLDirective = function GraphQLDirective(config) {
  _classCallCheck(this, GraphQLDirective);

  (0, _invariant2.default)(config.name, 'Directive must be named.');
  (0, _assertValidName.assertValidName)(config.name);
  (0, _invariant2.default)(Array.isArray(config.locations), 'Must provide locations for directive.');
  this.name = config.name;
  this.description = config.description;
  this.locations = config.locations;

  var args = config.args;
  if (!args) {
    this.args = [];
  } else {
    (0, _invariant2.default)(!Array.isArray(args), '@' + config.name + ' args must be an object with argument names as keys.');
    this.args = Object.keys(args).map(function (argName) {
      (0, _assertValidName.assertValidName)(argName);
      var arg = args[argName];
      (0, _invariant2.default)((0, _definition.isInputType)(arg.type), '@' + config.name + '(' + argName + ':) argument type must be ' + ('Input Type but got: ' + String(arg.type) + '.'));
      return {
        name: argName,
        description: arg.description === undefined ? null : arg.description,
        type: arg.type,
        defaultValue: arg.defaultValue
      };
    });
  }
};

/**
 * Used to conditionally include fields or fragments.
 */
var GraphQLIncludeDirective = exports.GraphQLIncludeDirective = new GraphQLDirective({
  name: 'include',
  description: 'Directs the executor to include this field or fragment only when ' + 'the `if` argument is true.',
  locations: [DirectiveLocation.FIELD, DirectiveLocation.FRAGMENT_SPREAD, DirectiveLocation.INLINE_FRAGMENT],
  args: {
    'if': {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      description: 'Included when true.'
    }
  }
});

/**
 * Used to conditionally skip (exclude) fields or fragments.
 */
var GraphQLSkipDirective = exports.GraphQLSkipDirective = new GraphQLDirective({
  name: 'skip',
  description: 'Directs the executor to skip this field or fragment when the `if` ' + 'argument is true.',
  locations: [DirectiveLocation.FIELD, DirectiveLocation.FRAGMENT_SPREAD, DirectiveLocation.INLINE_FRAGMENT],
  args: {
    'if': {
      type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
      description: 'Skipped when true.'
    }
  }
});

/**
 * Constant string used for default reason for a deprecation.
 */
var DEFAULT_DEPRECATION_REASON = exports.DEFAULT_DEPRECATION_REASON = 'No longer supported';

/**
 * Used to declare element of a GraphQL schema as deprecated.
 */
var GraphQLDeprecatedDirective = exports.GraphQLDeprecatedDirective = new GraphQLDirective({
  name: 'deprecated',
  description: 'Marks an element of a GraphQL schema as no longer supported.',
  locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.ENUM_VALUE],
  args: {
    reason: {
      type: _scalars.GraphQLString,
      description: 'Explains why this element was deprecated, usually also including a ' + 'suggestion for how to access supported similar data. Formatted ' + 'in [Markdown](https://daringfireball.net/projects/markdown/).',
      defaultValue: DEFAULT_DEPRECATION_REASON
    }
  }
});

/**
 * The full list of specified directives.
 */
var specifiedDirectives = exports.specifiedDirectives = [GraphQLIncludeDirective, GraphQLSkipDirective, GraphQLDeprecatedDirective];

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeFromAST = undefined;

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _definition = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Given a Schema and an AST node describing a type, return a GraphQLType
 * definition which applies to that type. For example, if provided the parsed
 * AST node for `[User]`, a GraphQLList instance will be returned, containing
 * the type called "User" found in the schema. If a type called "User" is not
 * found in the schema, then undefined will be returned.
 */
/* eslint-disable no-redeclare */
function typeFromASTImpl(schema, typeNode) {
  /* eslint-enable no-redeclare */
  var innerType = void 0;
  if (typeNode.kind === Kind.LIST_TYPE) {
    innerType = typeFromAST(schema, typeNode.type);
    return innerType && new _definition.GraphQLList(innerType);
  }
  if (typeNode.kind === Kind.NON_NULL_TYPE) {
    innerType = typeFromAST(schema, typeNode.type);
    return innerType && new _definition.GraphQLNonNull(innerType);
  }
  (0, _invariant2.default)(typeNode.kind === Kind.NAMED_TYPE, 'Must be a named type.');
  return schema.getType(typeNode.name.value);
}
// This will export typeFromAST with the correct type, but currently exposes
// ~26 errors: https://gist.github.com/4a29403a99a8186fcb15064d69c5f3ae
// export var typeFromAST: typeof typeFromASTType = typeFromASTImpl;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var typeFromAST = exports.typeFromAST = typeFromASTImpl;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQLID = exports.GraphQLBoolean = exports.GraphQLString = exports.GraphQLFloat = exports.GraphQLInt = undefined;

var _definition = __webpack_require__(1);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// As per the GraphQL Spec, Integers are only treated as valid when a valid
// 32-bit signed integer, providing the broadest support across platforms.
//
// n.b. JavaScript's integers are safe between -(2^53 - 1) and 2^53 - 1 because
// they are internally represented as IEEE 754 doubles.

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var MAX_INT = 2147483647;
var MIN_INT = -2147483648;

function coerceInt(value) {
  if (value === '') {
    throw new TypeError('Int cannot represent non 32-bit signed integer value: (empty string)');
  }
  var num = Number(value);
  if (num !== num || num > MAX_INT || num < MIN_INT) {
    throw new TypeError('Int cannot represent non 32-bit signed integer value: ' + String(value));
  }
  var int = Math.floor(num);
  if (int !== num) {
    throw new TypeError('Int cannot represent non-integer value: ' + String(value));
  }
  return int;
}

var GraphQLInt = exports.GraphQLInt = new _definition.GraphQLScalarType({
  name: 'Int',
  description: 'The `Int` scalar type represents non-fractional signed whole numeric ' + 'values. Int can represent values between -(2^31) and 2^31 - 1. ',
  serialize: coerceInt,
  parseValue: coerceInt,
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      var num = parseInt(ast.value, 10);
      if (num <= MAX_INT && num >= MIN_INT) {
        return num;
      }
    }
    return null;
  }
});

function coerceFloat(value) {
  if (value === '') {
    throw new TypeError('Float cannot represent non numeric value: (empty string)');
  }
  var num = Number(value);
  if (num === num) {
    return num;
  }
  throw new TypeError('Float cannot represent non numeric value: ' + String(value));
}

var GraphQLFloat = exports.GraphQLFloat = new _definition.GraphQLScalarType({
  name: 'Float',
  description: 'The `Float` scalar type represents signed double-precision fractional ' + 'values as specified by ' + '[IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point). ',
  serialize: coerceFloat,
  parseValue: coerceFloat,
  parseLiteral: function parseLiteral(ast) {
    return ast.kind === Kind.FLOAT || ast.kind === Kind.INT ? parseFloat(ast.value) : null;
  }
});

var GraphQLString = exports.GraphQLString = new _definition.GraphQLScalarType({
  name: 'String',
  description: 'The `String` scalar type represents textual data, represented as UTF-8 ' + 'character sequences. The String type is most often used by GraphQL to ' + 'represent free-form human-readable text.',
  serialize: String,
  parseValue: String,
  parseLiteral: function parseLiteral(ast) {
    return ast.kind === Kind.STRING ? ast.value : null;
  }
});

var GraphQLBoolean = exports.GraphQLBoolean = new _definition.GraphQLScalarType({
  name: 'Boolean',
  description: 'The `Boolean` scalar type represents `true` or `false`.',
  serialize: Boolean,
  parseValue: Boolean,
  parseLiteral: function parseLiteral(ast) {
    return ast.kind === Kind.BOOLEAN ? ast.value : null;
  }
});

var GraphQLID = exports.GraphQLID = new _definition.GraphQLScalarType({
  name: 'ID',
  description: 'The `ID` scalar type represents a unique identifier, often used to ' + 'refetch an object or as key for a cache. The ID type appears in a JSON ' + 'response as a String; however, it is not intended to be human-readable. ' + 'When expected as an input type, any string (such as `"4"`) or integer ' + '(such as `4`) input value will be accepted as an ID.',
  serialize: String,
  parseValue: String,
  parseLiteral: function parseLiteral(ast) {
    return ast.kind === Kind.STRING || ast.kind === Kind.INT ? ast.value : null;
  }
});

/***/ }),
/* 13 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNullish;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Returns true if a value is null, undefined, or NaN.
 */
function isNullish(value) {
  return value === null || value === undefined || value !== value;
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeNameMetaFieldDef = exports.TypeMetaFieldDef = exports.SchemaMetaFieldDef = exports.__TypeKind = exports.TypeKind = exports.__EnumValue = exports.__InputValue = exports.__Field = exports.__Type = exports.__DirectiveLocation = exports.__Directive = exports.__Schema = undefined;

var _isInvalid = __webpack_require__(27);

var _isInvalid2 = _interopRequireDefault(_isInvalid);

var _astFromValue = __webpack_require__(51);

var _printer = __webpack_require__(7);

var _definition = __webpack_require__(1);

var _scalars = __webpack_require__(12);

var _directives = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var __Schema = exports.__Schema = new _definition.GraphQLObjectType({
  name: '__Schema',
  isIntrospection: true,
  description: 'A GraphQL Schema defines the capabilities of a GraphQL server. It ' + 'exposes all available types and directives on the server, as well as ' + 'the entry points for query, mutation, and subscription operations.',
  fields: function fields() {
    return {
      types: {
        description: 'A list of all types supported by this server.',
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type))),
        resolve: function resolve(schema) {
          var typeMap = schema.getTypeMap();
          return Object.keys(typeMap).map(function (key) {
            return typeMap[key];
          });
        }
      },
      queryType: {
        description: 'The type that query operations will be rooted at.',
        type: new _definition.GraphQLNonNull(__Type),
        resolve: function resolve(schema) {
          return schema.getQueryType();
        }
      },
      mutationType: {
        description: 'If this server supports mutation, the type that ' + 'mutation operations will be rooted at.',
        type: __Type,
        resolve: function resolve(schema) {
          return schema.getMutationType();
        }
      },
      subscriptionType: {
        description: 'If this server support subscription, the type that ' + 'subscription operations will be rooted at.',
        type: __Type,
        resolve: function resolve(schema) {
          return schema.getSubscriptionType();
        }
      },
      directives: {
        description: 'A list of all directives supported by this server.',
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__Directive))),
        resolve: function resolve(schema) {
          return schema.getDirectives();
        }
      }
    };
  }
});

var __Directive = exports.__Directive = new _definition.GraphQLObjectType({
  name: '__Directive',
  isIntrospection: true,
  description: 'A Directive provides a way to describe alternate runtime execution and ' + 'type validation behavior in a GraphQL document.' + '\n\nIn some cases, you need to provide options to alter GraphQL\'s ' + 'execution behavior in ways field arguments will not suffice, such as ' + 'conditionally including or skipping a field. Directives provide this by ' + 'describing additional information to the executor.',
  fields: function fields() {
    return {
      name: { type: new _definition.GraphQLNonNull(_scalars.GraphQLString) },
      description: { type: _scalars.GraphQLString },
      locations: {
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__DirectiveLocation)))
      },
      args: {
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__InputValue))),
        resolve: function resolve(directive) {
          return directive.args || [];
        }
      },
      // NOTE: the following three fields are deprecated and are no longer part
      // of the GraphQL specification.
      onOperation: {
        deprecationReason: 'Use `locations`.',
        type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
        resolve: function resolve(d) {
          return d.locations.indexOf(_directives.DirectiveLocation.QUERY) !== -1 || d.locations.indexOf(_directives.DirectiveLocation.MUTATION) !== -1 || d.locations.indexOf(_directives.DirectiveLocation.SUBSCRIPTION) !== -1;
        }
      },
      onFragment: {
        deprecationReason: 'Use `locations`.',
        type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
        resolve: function resolve(d) {
          return d.locations.indexOf(_directives.DirectiveLocation.FRAGMENT_SPREAD) !== -1 || d.locations.indexOf(_directives.DirectiveLocation.INLINE_FRAGMENT) !== -1 || d.locations.indexOf(_directives.DirectiveLocation.FRAGMENT_DEFINITION) !== -1;
        }
      },
      onField: {
        deprecationReason: 'Use `locations`.',
        type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
        resolve: function resolve(d) {
          return d.locations.indexOf(_directives.DirectiveLocation.FIELD) !== -1;
        }
      }
    };
  }
});

var __DirectiveLocation = exports.__DirectiveLocation = new _definition.GraphQLEnumType({
  name: '__DirectiveLocation',
  isIntrospection: true,
  description: 'A Directive can be adjacent to many parts of the GraphQL language, a ' + '__DirectiveLocation describes one such possible adjacencies.',
  values: {
    QUERY: {
      value: _directives.DirectiveLocation.QUERY,
      description: 'Location adjacent to a query operation.'
    },
    MUTATION: {
      value: _directives.DirectiveLocation.MUTATION,
      description: 'Location adjacent to a mutation operation.'
    },
    SUBSCRIPTION: {
      value: _directives.DirectiveLocation.SUBSCRIPTION,
      description: 'Location adjacent to a subscription operation.'
    },
    FIELD: {
      value: _directives.DirectiveLocation.FIELD,
      description: 'Location adjacent to a field.'
    },
    FRAGMENT_DEFINITION: {
      value: _directives.DirectiveLocation.FRAGMENT_DEFINITION,
      description: 'Location adjacent to a fragment definition.'
    },
    FRAGMENT_SPREAD: {
      value: _directives.DirectiveLocation.FRAGMENT_SPREAD,
      description: 'Location adjacent to a fragment spread.'
    },
    INLINE_FRAGMENT: {
      value: _directives.DirectiveLocation.INLINE_FRAGMENT,
      description: 'Location adjacent to an inline fragment.'
    },
    SCHEMA: {
      value: _directives.DirectiveLocation.SCHEMA,
      description: 'Location adjacent to a schema definition.'
    },
    SCALAR: {
      value: _directives.DirectiveLocation.SCALAR,
      description: 'Location adjacent to a scalar definition.'
    },
    OBJECT: {
      value: _directives.DirectiveLocation.OBJECT,
      description: 'Location adjacent to an object type definition.'
    },
    FIELD_DEFINITION: {
      value: _directives.DirectiveLocation.FIELD_DEFINITION,
      description: 'Location adjacent to a field definition.'
    },
    ARGUMENT_DEFINITION: {
      value: _directives.DirectiveLocation.ARGUMENT_DEFINITION,
      description: 'Location adjacent to an argument definition.'
    },
    INTERFACE: {
      value: _directives.DirectiveLocation.INTERFACE,
      description: 'Location adjacent to an interface definition.'
    },
    UNION: {
      value: _directives.DirectiveLocation.UNION,
      description: 'Location adjacent to a union definition.'
    },
    ENUM: {
      value: _directives.DirectiveLocation.ENUM,
      description: 'Location adjacent to an enum definition.'
    },
    ENUM_VALUE: {
      value: _directives.DirectiveLocation.ENUM_VALUE,
      description: 'Location adjacent to an enum value definition.'
    },
    INPUT_OBJECT: {
      value: _directives.DirectiveLocation.INPUT_OBJECT,
      description: 'Location adjacent to an input object type definition.'
    },
    INPUT_FIELD_DEFINITION: {
      value: _directives.DirectiveLocation.INPUT_FIELD_DEFINITION,
      description: 'Location adjacent to an input object field definition.'
    }
  }
});

var __Type = exports.__Type = new _definition.GraphQLObjectType({
  name: '__Type',
  isIntrospection: true,
  description: 'The fundamental unit of any GraphQL Schema is the type. There are ' + 'many kinds of types in GraphQL as represented by the `__TypeKind` enum.' + '\n\nDepending on the kind of a type, certain fields describe ' + 'information about that type. Scalar types provide no information ' + 'beyond a name and description, while Enum types provide their values. ' + 'Object and Interface types provide the fields they describe. Abstract ' + 'types, Union and Interface, provide the Object types possible ' + 'at runtime. List and NonNull types compose other types.',
  fields: function fields() {
    return {
      kind: {
        type: new _definition.GraphQLNonNull(__TypeKind),
        resolve: function resolve(type) {
          if (type instanceof _definition.GraphQLScalarType) {
            return TypeKind.SCALAR;
          } else if (type instanceof _definition.GraphQLObjectType) {
            return TypeKind.OBJECT;
          } else if (type instanceof _definition.GraphQLInterfaceType) {
            return TypeKind.INTERFACE;
          } else if (type instanceof _definition.GraphQLUnionType) {
            return TypeKind.UNION;
          } else if (type instanceof _definition.GraphQLEnumType) {
            return TypeKind.ENUM;
          } else if (type instanceof _definition.GraphQLInputObjectType) {
            return TypeKind.INPUT_OBJECT;
          } else if (type instanceof _definition.GraphQLList) {
            return TypeKind.LIST;
          } else if (type instanceof _definition.GraphQLNonNull) {
            return TypeKind.NON_NULL;
          }
          throw new Error('Unknown kind of type: ' + type);
        }
      },
      name: { type: _scalars.GraphQLString },
      description: { type: _scalars.GraphQLString },
      fields: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Field)),
        args: {
          includeDeprecated: { type: _scalars.GraphQLBoolean, defaultValue: false }
        },
        resolve: function resolve(type, _ref) {
          var includeDeprecated = _ref.includeDeprecated;

          if (type instanceof _definition.GraphQLObjectType || type instanceof _definition.GraphQLInterfaceType) {
            var fieldMap = type.getFields();
            var fields = Object.keys(fieldMap).map(function (fieldName) {
              return fieldMap[fieldName];
            });
            if (!includeDeprecated) {
              fields = fields.filter(function (field) {
                return !field.deprecationReason;
              });
            }
            return fields;
          }
          return null;
        }
      },
      interfaces: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),
        resolve: function resolve(type) {
          if (type instanceof _definition.GraphQLObjectType) {
            return type.getInterfaces();
          }
        }
      },
      possibleTypes: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),
        resolve: function resolve(type, args, context, _ref2) {
          var schema = _ref2.schema;

          if ((0, _definition.isAbstractType)(type)) {
            return schema.getPossibleTypes(type);
          }
        }
      },
      enumValues: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__EnumValue)),
        args: {
          includeDeprecated: { type: _scalars.GraphQLBoolean, defaultValue: false }
        },
        resolve: function resolve(type, _ref3) {
          var includeDeprecated = _ref3.includeDeprecated;

          if (type instanceof _definition.GraphQLEnumType) {
            var values = type.getValues();
            if (!includeDeprecated) {
              values = values.filter(function (value) {
                return !value.deprecationReason;
              });
            }
            return values;
          }
        }
      },
      inputFields: {
        type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__InputValue)),
        resolve: function resolve(type) {
          if (type instanceof _definition.GraphQLInputObjectType) {
            var fieldMap = type.getFields();
            return Object.keys(fieldMap).map(function (fieldName) {
              return fieldMap[fieldName];
            });
          }
        }
      },
      ofType: { type: __Type }
    };
  }
});

var __Field = exports.__Field = new _definition.GraphQLObjectType({
  name: '__Field',
  isIntrospection: true,
  description: 'Object and Interface types are described by a list of Fields, each of ' + 'which has a name, potentially a list of arguments, and a return type.',
  fields: function fields() {
    return {
      name: { type: new _definition.GraphQLNonNull(_scalars.GraphQLString) },
      description: { type: _scalars.GraphQLString },
      args: {
        type: new _definition.GraphQLNonNull(new _definition.GraphQLList(new _definition.GraphQLNonNull(__InputValue))),
        resolve: function resolve(field) {
          return field.args || [];
        }
      },
      type: { type: new _definition.GraphQLNonNull(__Type) },
      isDeprecated: { type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean) },
      deprecationReason: {
        type: _scalars.GraphQLString
      }
    };
  }
});

var __InputValue = exports.__InputValue = new _definition.GraphQLObjectType({
  name: '__InputValue',
  isIntrospection: true,
  description: 'Arguments provided to Fields or Directives and the input fields of an ' + 'InputObject are represented as Input Values which describe their type ' + 'and optionally a default value.',
  fields: function fields() {
    return {
      name: { type: new _definition.GraphQLNonNull(_scalars.GraphQLString) },
      description: { type: _scalars.GraphQLString },
      type: { type: new _definition.GraphQLNonNull(__Type) },
      defaultValue: {
        type: _scalars.GraphQLString,
        description: 'A GraphQL-formatted string representing the default value for this ' + 'input value.',
        resolve: function resolve(inputVal) {
          return (0, _isInvalid2.default)(inputVal.defaultValue) ? null : (0, _printer.print)((0, _astFromValue.astFromValue)(inputVal.defaultValue, inputVal.type));
        }
      }
    };
  }
});

var __EnumValue = exports.__EnumValue = new _definition.GraphQLObjectType({
  name: '__EnumValue',
  isIntrospection: true,
  description: 'One possible value for a given Enum. Enum values are unique values, not ' + 'a placeholder for a string or numeric value. However an Enum value is ' + 'returned in a JSON response as a string.',
  fields: function fields() {
    return {
      name: { type: new _definition.GraphQLNonNull(_scalars.GraphQLString) },
      description: { type: _scalars.GraphQLString },
      isDeprecated: { type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean) },
      deprecationReason: {
        type: _scalars.GraphQLString
      }
    };
  }
});

var TypeKind = exports.TypeKind = {
  SCALAR: 'SCALAR',
  OBJECT: 'OBJECT',
  INTERFACE: 'INTERFACE',
  UNION: 'UNION',
  ENUM: 'ENUM',
  INPUT_OBJECT: 'INPUT_OBJECT',
  LIST: 'LIST',
  NON_NULL: 'NON_NULL'
};

var __TypeKind = exports.__TypeKind = new _definition.GraphQLEnumType({
  name: '__TypeKind',
  isIntrospection: true,
  description: 'An enum describing what kind of type a given `__Type` is.',
  values: {
    SCALAR: {
      value: TypeKind.SCALAR,
      description: 'Indicates this type is a scalar.'
    },
    OBJECT: {
      value: TypeKind.OBJECT,
      description: 'Indicates this type is an object. ' + '`fields` and `interfaces` are valid fields.'
    },
    INTERFACE: {
      value: TypeKind.INTERFACE,
      description: 'Indicates this type is an interface. ' + '`fields` and `possibleTypes` are valid fields.'
    },
    UNION: {
      value: TypeKind.UNION,
      description: 'Indicates this type is a union. ' + '`possibleTypes` is a valid field.'
    },
    ENUM: {
      value: TypeKind.ENUM,
      description: 'Indicates this type is an enum. ' + '`enumValues` is a valid field.'
    },
    INPUT_OBJECT: {
      value: TypeKind.INPUT_OBJECT,
      description: 'Indicates this type is an input object. ' + '`inputFields` is a valid field.'
    },
    LIST: {
      value: TypeKind.LIST,
      description: 'Indicates this type is a list. ' + '`ofType` is a valid field.'
    },
    NON_NULL: {
      value: TypeKind.NON_NULL,
      description: 'Indicates this type is a non-null. ' + '`ofType` is a valid field.'
    }
  }
});

/**
 * Note that these are GraphQLField and not GraphQLFieldConfig,
 * so the format for args is different.
 */

var SchemaMetaFieldDef = exports.SchemaMetaFieldDef = {
  name: '__schema',
  type: new _definition.GraphQLNonNull(__Schema),
  description: 'Access the current type schema of this server.',
  args: [],
  resolve: function resolve(source, args, context, _ref4) {
    var schema = _ref4.schema;
    return schema;
  }
};

var TypeMetaFieldDef = exports.TypeMetaFieldDef = {
  name: '__type',
  type: __Type,
  description: 'Request the type information of a single type.',
  args: [{ name: 'name', type: new _definition.GraphQLNonNull(_scalars.GraphQLString) }],
  resolve: function resolve(source, _ref5, context, _ref6) {
    var name = _ref5.name;
    var schema = _ref6.schema;
    return schema.getType(name);
  }
};

var TypeNameMetaFieldDef = exports.TypeNameMetaFieldDef = {
  name: '__typename',
  type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
  description: 'The name of the current Object type at runtime.',
  args: [],
  resolve: function resolve(source, args, context, _ref7) {
    var parentType = _ref7.parentType;
    return parentType.name;
  }
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(22)
  , createDesc = __webpack_require__(58);
module.exports = __webpack_require__(18) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(31);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(39)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2016, Lee Byron
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @ignore
 */

/**
 * [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator)
 * is a *protocol* which describes a standard way to produce a sequence of
 * values, typically the values of the Iterable represented by this Iterator.
 *
 * While described by the [ES2015 version of JavaScript](http://www.ecma-international.org/ecma-262/6.0/#sec-iterator-interface)
 * it can be utilized by any version of JavaScript.
 *
 * @typedef {Object} Iterator
 * @template T The type of each iterated value
 * @property {function (): { value: T, done: boolean }} next
 *   A method which produces either the next value in a sequence or a result
 *   where the `done` property is `true` indicating the end of the Iterator.
 */

/**
 * [Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
 * is a *protocol* which when implemented allows a JavaScript object to define
 * their iteration behavior, such as what values are looped over in a `for..of`
 * loop or `iterall`'s `forEach` function. Many [built-in types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#Builtin_iterables)
 * implement the Iterable protocol, including `Array` and `Map`.
 *
 * While described by the [ES2015 version of JavaScript](http://www.ecma-international.org/ecma-262/6.0/#sec-iterable-interface)
 * it can be utilized by any version of JavaScript.
 *
 * @typedef {Object} Iterable
 * @template T The type of each iterated value
 * @property {function (): Iterator<T>} Symbol.iterator
 *   A method which produces an Iterator for this Iterable.
 */

// In ES2015 (or a polyfilled) environment, this will be Symbol.iterator
var SYMBOL_ITERATOR = typeof Symbol === 'function' && Symbol.iterator

/**
 * A property name to be used as the name of an Iterable's method responsible
 * for producing an Iterator, referred to as `@@iterator`. Typically represents
 * the value `Symbol.iterator` but falls back to the string `"@@iterator"` when
 * `Symbol.iterator` is not defined.
 *
 * Use `$$iterator` for defining new Iterables instead of `Symbol.iterator`,
 * but do not use it for accessing existing Iterables, instead use
 * `getIterator()` or `isIterable()`.
 *
 * @example
 *
 * var $$iterator = require('iterall').$$iterator
 *
 * function Counter (to) {
 *   this.to = to
 * }
 *
 * Counter.prototype[$$iterator] = function () {
 *   return {
 *     to: this.to,
 *     num: 0,
 *     next () {
 *       if (this.num >= this.to) {
 *         return { value: undefined, done: true }
 *       }
 *       return { value: this.num++, done: false }
 *     }
 *   }
 * }
 *
 * var counter = new Counter(3)
 * for (var number of counter) {
 *   console.log(number) // 0 ... 1 ... 2
 * }
 *
 * @type {Symbol|string}
 */
var $$iterator = SYMBOL_ITERATOR || '@@iterator'
exports.$$iterator = $$iterator

/**
 * Returns true if the provided object implements the Iterator protocol via
 * either implementing a `Symbol.iterator` or `"@@iterator"` method.
 *
 * @example
 *
 * var isIterable = require('iterall').isIterable
 * isIterable([ 1, 2, 3 ]) // true
 * isIterable('ABC') // true
 * isIterable({ length: 1, 0: 'Alpha' }) // false
 * isIterable({ key: 'value' }) // false
 * isIterable(new Map()) // true
 *
 * @param obj
 *   A value which might implement the Iterable protocol.
 * @return {boolean} true if Iterable.
 */
function isIterable(obj) {
  return !!getIteratorMethod(obj)
}
exports.isIterable = isIterable

/**
 * Returns true if the provided object implements the Array-like protocol via
 * defining a positive-integer `length` property.
 *
 * @example
 *
 * var isArrayLike = require('iterall').isArrayLike
 * isArrayLike([ 1, 2, 3 ]) // true
 * isArrayLike('ABC') // true
 * isArrayLike({ length: 1, 0: 'Alpha' }) // true
 * isArrayLike({ key: 'value' }) // false
 * isArrayLike(new Map()) // false
 *
 * @param obj
 *   A value which might implement the Array-like protocol.
 * @return {boolean} true if Array-like.
 */
function isArrayLike(obj) {
  var length = obj != null && obj.length
  return typeof length === 'number' && length >= 0 && length % 1 === 0
}
exports.isArrayLike = isArrayLike

/**
 * Returns true if the provided object is an Object (i.e. not a string literal)
 * and is either Iterable or Array-like.
 *
 * This may be used in place of [Array.isArray()][isArray] to determine if an
 * object should be iterated-over. It always excludes string literals and
 * includes Arrays (regardless of if it is Iterable). It also includes other
 * Array-like objects such as NodeList, TypedArray, and Buffer.
 *
 * @example
 *
 * var isCollection = require('iterall').isCollection
 * isCollection([ 1, 2, 3 ]) // true
 * isCollection('ABC') // false
 * isCollection({ length: 1, 0: 'Alpha' }) // true
 * isCollection({ key: 'value' }) // false
 * isCollection(new Map()) // true
 *
 * @example
 *
 * var forEach = require('iterall').forEach
 * if (isCollection(obj)) {
 *   forEach(obj, function (value) {
 *     console.log(value)
 *   })
 * }
 *
 * @param obj
 *   An Object value which might implement the Iterable or Array-like protocols.
 * @return {boolean} true if Iterable or Array-like Object.
 */
function isCollection(obj) {
  return Object(obj) === obj && (isArrayLike(obj) || isIterable(obj))
}
exports.isCollection = isCollection

/**
 * If the provided object implements the Iterator protocol, its Iterator object
 * is returned. Otherwise returns undefined.
 *
 * @example
 *
 * var getIterator = require('iterall').getIterator
 * var iterator = getIterator([ 1, 2, 3 ])
 * iterator.next() // { value: 1, done: false }
 * iterator.next() // { value: 2, done: false }
 * iterator.next() // { value: 3, done: false }
 * iterator.next() // { value: undefined, done: true }
 *
 * @template T the type of each iterated value
 * @param {Iterable<T>} iterable
 *   An Iterable object which is the source of an Iterator.
 * @return {Iterator<T>} new Iterator instance.
 */
function getIterator(iterable) {
  var method = getIteratorMethod(iterable)
  if (method) {
    return method.call(iterable)
  }
}
exports.getIterator = getIterator

/**
 * If the provided object implements the Iterator protocol, the method
 * responsible for producing its Iterator object is returned.
 *
 * This is used in rare cases for performance tuning. This method must be called
 * with obj as the contextual this-argument.
 *
 * @example
 *
 * var getIteratorMethod = require('iterall').getIteratorMethod
 * var myArray = [ 1, 2, 3 ]
 * var method = getIteratorMethod(myArray)
 * if (method) {
 *   var iterator = method.call(myArray)
 * }
 *
 * @template T the type of each iterated value
 * @param {Iterable<T>} iterable
 *   An Iterable object which defines an `@@iterator` method.
 * @return {function(): Iterator<T>} `@@iterator` method.
 */
function getIteratorMethod(iterable) {
  if (iterable != null) {
    var method =
      (SYMBOL_ITERATOR && iterable[SYMBOL_ITERATOR]) || iterable['@@iterator']
    if (typeof method === 'function') {
      return method
    }
  }
}
exports.getIteratorMethod = getIteratorMethod

/**
 * Similar to `getIterator()`, this method returns a new Iterator given an
 * Iterable. However it will also create an Iterator for a non-Iterable
 * Array-like collection, such as Array in a non-ES2015 environment.
 *
 * `createIterator` is complimentary to `forEach`, but allows a "pull"-based
 * iteration as opposed to `forEach`'s "push"-based iteration.
 *
 * `createIterator` produces an Iterator for Array-likes with the same behavior
 * as ArrayIteratorPrototype described in the ECMAScript specification, and
 * does *not* skip over "holes".
 *
 * @example
 *
 * var createIterator = require('iterall').createIterator
 *
 * var myArraylike = { length: 3, 0: 'Alpha', 1: 'Bravo', 2: 'Charlie' }
 * var iterator = createIterator(myArraylike)
 * iterator.next() // { value: 'Alpha', done: false }
 * iterator.next() // { value: 'Bravo', done: false }
 * iterator.next() // { value: 'Charlie', done: false }
 * iterator.next() // { value: undefined, done: true }
 *
 * @template T the type of each iterated value
 * @param {Iterable<T>|{ length: number }} collection
 *   An Iterable or Array-like object to produce an Iterator.
 * @return {Iterator<T>} new Iterator instance.
 */
function createIterator(collection) {
  if (collection != null) {
    var iterator = getIterator(collection)
    if (iterator) {
      return iterator
    }
    if (isArrayLike(collection)) {
      return new ArrayLikeIterator(collection)
    }
  }
}
exports.createIterator = createIterator

// When the object provided to `createIterator` is not Iterable but is
// Array-like, this simple Iterator is created.
function ArrayLikeIterator(obj) {
  this._o = obj
  this._i = 0
}

// Note: all Iterators are themselves Iterable.
ArrayLikeIterator.prototype[$$iterator] = function() {
  return this
}

// A simple state-machine determines the IteratorResult returned, yielding
// each value in the Array-like object in order of their indicies.
ArrayLikeIterator.prototype.next = function() {
  if (this._o === void 0 || this._i >= this._o.length) {
    this._o = void 0
    return { value: void 0, done: true }
  }
  return { value: this._o[this._i++], done: false }
}

/**
 * Given an object which either implements the Iterable protocol or is
 * Array-like, iterate over it, calling the `callback` at each iteration.
 *
 * Use `forEach` where you would expect to use a `for ... of` loop in ES6.
 * However `forEach` adheres to the behavior of [Array#forEach][] described in
 * the ECMAScript specification, skipping over "holes" in Array-likes. It will
 * also delegate to a `forEach` method on `collection` if one is defined,
 * ensuring native performance for `Arrays`.
 *
 * Similar to [Array#forEach][], the `callback` function accepts three
 * arguments, and is provided with `thisArg` as the calling context.
 *
 * Note: providing an infinite Iterator to forEach will produce an error.
 *
 * [Array#forEach]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 *
 * @example
 *
 * var forEach = require('iterall').forEach
 *
 * forEach(myIterable, function (value, index, iterable) {
 *   console.log(value, index, iterable === myIterable)
 * })
 *
 * @example
 *
 * // ES6:
 * for (let value of myIterable) {
 *   console.log(value)
 * }
 *
 * // Any JavaScript environment:
 * forEach(myIterable, function (value) {
 *   console.log(value)
 * })
 *
 * @template T the type of each iterated value
 * @param {Iterable<T>|{ length: number }} collection
 *   The Iterable or array to iterate over.
 * @param {function(T, number, object)} callback
 *   Function to execute for each iteration, taking up to three arguments
 * @param [thisArg]
 *   Optional. Value to use as `this` when executing `callback`.
 */
function forEach(collection, callback, thisArg) {
  if (collection != null) {
    if (typeof collection.forEach === 'function') {
      return collection.forEach(callback, thisArg)
    }
    var i = 0
    var iterator = getIterator(collection)
    if (iterator) {
      var step
      while (!(step = iterator.next()).done) {
        callback.call(thisArg, step.value, i++, collection)
        // Infinite Iterators could cause forEach to run forever.
        // After a very large number of iterations, produce an error.
        /* istanbul ignore if */
        if (i > 9999999) {
          throw new TypeError('Near-infinite iteration.')
        }
      }
    } else if (isArrayLike(collection)) {
      for (; i < collection.length; i++) {
        if (collection.hasOwnProperty(i)) {
          callback.call(thisArg, collection[i], i, collection)
        }
      }
    }
  }
}
exports.forEach = forEach

/////////////////////////////////////////////////////
//                                                 //
//                 ASYNC ITERATORS                 //
//                                                 //
/////////////////////////////////////////////////////

/**
 * [AsyncIterator](https://tc39.github.io/proposal-async-iteration/)
 * is a *protocol* which describes a standard way to produce and consume an
 * asynchronous sequence of values, typically the values of the AsyncIterable
 * represented by this AsyncIterator.
 *
 * AsyncIterator is similar to Observable or Stream.
 *
 * While described as a proposed addition to the [ES2017 version of JavaScript](https://tc39.github.io/proposal-async-iteration/)
 * it can be utilized by any version of JavaScript.
 *
 * @typedef {Object} AsyncIterator
 * @template T The type of each iterated value
 * @property {function (): Promise<{ value: T, done: boolean }>} next
 *   A method which produces a Promise which resolves to either the next value
 *   in a sequence or a result where the `done` property is `true` indicating
 *   the end of the sequence of values. It may also produce a Promise which
 *   becomes rejected, indicating a failure.
 */

/**
 * AsyncIterable is a *protocol* which when implemented allows a JavaScript
 * object to define their asynchronous iteration behavior, such as what values
 * are looped over in a `for-await-of` loop or `iterall`'s `forAwaitEach`
 * function.
 *
 * While described as a proposed addition to the [ES2017 version of JavaScript](https://tc39.github.io/proposal-async-iteration/)
 * it can be utilized by any version of JavaScript.
 *
 * @typedef {Object} AsyncIterable
 * @template T The type of each iterated value
 * @property {function (): AsyncIterator<T>} Symbol.asyncIterator
 *   A method which produces an AsyncIterator for this AsyncIterable.
 */

// In ES2017 (or a polyfilled) environment, this will be Symbol.asyncIterator
var SYMBOL_ASYNC_ITERATOR = typeof Symbol === 'function' && Symbol.asyncIterator

/**
 * A property name to be used as the name of an AsyncIterable's method
 * responsible for producing an Iterator, referred to as `@@asyncIterator`.
 * Typically represents the value `Symbol.asyncIterator` but falls back to the
 * string `"@@asyncIterator"` when `Symbol.asyncIterator` is not defined.
 *
 * Use `$$asyncIterator` for defining new AsyncIterables instead of
 * `Symbol.asyncIterator`, but do not use it for accessing existing Iterables,
 * instead use `getAsyncIterator()` or `isAsyncIterable()`.
 *
 * @example
 *
 * var $$asyncIterator = require('iterall').$$asyncIterator
 *
 * function Chirper (to) {
 *   this.to = to
 * }
 *
 * Chirper.prototype[$$asyncIterator] = function () {
 *   return {
 *     to: this.to,
 *     num: 0,
 *     next () {
 *       return new Promise(function (resolve) {
 *         if (this.num >= this.to) {
 *           resolve({ value: undefined, done: true })
 *         } else {
 *           setTimeout(function () {
 *             resolve({ value: this.num++, done: false })
 *           }, 1000)
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * var chirper = new Chirper(3)
 * for await (var number of chirper) {
 *   console.log(number) // 0 ...wait... 1 ...wait... 2
 * }
 *
 * @type {Symbol|string}
 */
var $$asyncIterator = SYMBOL_ASYNC_ITERATOR || '@@asyncIterator'
exports.$$asyncIterator = $$asyncIterator

/**
 * Returns true if the provided object implements the AsyncIterator protocol via
 * either implementing a `Symbol.asyncIterator` or `"@@asyncIterator"` method.
 *
 * @example
 *
 * var isAsyncIterable = require('iterall').isAsyncIterable
 * isAsyncIterable(myStream) // true
 * isAsyncIterable('ABC') // false
 *
 * @param obj
 *   A value which might implement the AsyncIterable protocol.
 * @return {boolean} true if AsyncIterable.
 */
function isAsyncIterable(obj) {
  return !!getAsyncIteratorMethod(obj)
}
exports.isAsyncIterable = isAsyncIterable

/**
 * If the provided object implements the AsyncIterator protocol, its
 * AsyncIterator object is returned. Otherwise returns undefined.
 *
 * @example
 *
 * var getAsyncIterator = require('iterall').getAsyncIterator
 * var asyncIterator = getAsyncIterator(myStream)
 * asyncIterator.next().then(console.log) // { value: 1, done: false }
 * asyncIterator.next().then(console.log) // { value: 2, done: false }
 * asyncIterator.next().then(console.log) // { value: 3, done: false }
 * asyncIterator.next().then(console.log) // { value: undefined, done: true }
 *
 * @template T the type of each iterated value
 * @param {AsyncIterable<T>} asyncIterable
 *   An AsyncIterable object which is the source of an AsyncIterator.
 * @return {AsyncIterator<T>} new AsyncIterator instance.
 */
function getAsyncIterator(asyncIterable) {
  var method = getAsyncIteratorMethod(asyncIterable)
  if (method) {
    return method.call(asyncIterable)
  }
}
exports.getAsyncIterator = getAsyncIterator

/**
 * If the provided object implements the AsyncIterator protocol, the method
 * responsible for producing its AsyncIterator object is returned.
 *
 * This is used in rare cases for performance tuning. This method must be called
 * with obj as the contextual this-argument.
 *
 * @example
 *
 * var getAsyncIteratorMethod = require('iterall').getAsyncIteratorMethod
 * var method = getAsyncIteratorMethod(myStream)
 * if (method) {
 *   var asyncIterator = method.call(myStream)
 * }
 *
 * @template T the type of each iterated value
 * @param {AsyncIterable<T>} asyncIterable
 *   An AsyncIterable object which defines an `@@asyncIterator` method.
 * @return {function(): AsyncIterator<T>} `@@asyncIterator` method.
 */
function getAsyncIteratorMethod(asyncIterable) {
  if (asyncIterable != null) {
    var method =
      (SYMBOL_ASYNC_ITERATOR && asyncIterable[SYMBOL_ASYNC_ITERATOR]) ||
      asyncIterable['@@asyncIterator']
    if (typeof method === 'function') {
      return method
    }
  }
}
exports.getAsyncIteratorMethod = getAsyncIteratorMethod

/**
 * Similar to `getAsyncIterator()`, this method returns a new AsyncIterator
 * given an AsyncIterable. However it will also create an AsyncIterator for a
 * non-async Iterable as well as non-Iterable Array-like collection, such as
 * Array in a pre-ES2015 environment.
 *
 * `createAsyncIterator` is complimentary to `forAwaitEach`, but allows a
 * buffering "pull"-based iteration as opposed to `forAwaitEach`'s
 * "push"-based iteration.
 *
 * `createAsyncIterator` produces an AsyncIterator for non-async Iterables as
 * described in the ECMAScript proposal [Async-from-Sync Iterator Objects](https://tc39.github.io/proposal-async-iteration/#sec-async-from-sync-iterator-objects).
 *
 * > Note: Creating `AsyncIterator`s requires the existence of `Promise`.
 * > While `Promise` has been available in modern browsers for a number of
 * > years, legacy browsers (like IE 11) may require a polyfill.
 *
 * @example
 *
 * var createAsyncIterator = require('iterall').createAsyncIterator
 *
 * var myArraylike = { length: 3, 0: 'Alpha', 1: 'Bravo', 2: 'Charlie' }
 * var iterator = createAsyncIterator(myArraylike)
 * iterator.next().then(console.log) // { value: 'Alpha', done: false }
 * iterator.next().then(console.log) // { value: 'Bravo', done: false }
 * iterator.next().then(console.log) // { value: 'Charlie', done: false }
 * iterator.next().then(console.log) // { value: undefined, done: true }
 *
 * @template T the type of each iterated value
 * @param {AsyncIterable<T>|Iterable<T>|{ length: number }} source
 *   An AsyncIterable, Iterable, or Array-like object to produce an Iterator.
 * @return {AsyncIterator<T>} new AsyncIterator instance.
 */
function createAsyncIterator(source) {
  if (source != null) {
    var asyncIterator = getAsyncIterator(source)
    if (asyncIterator) {
      return asyncIterator
    }
    var iterator = createIterator(source)
    if (iterator) {
      return new AsyncFromSyncIterator(iterator)
    }
  }
}
exports.createAsyncIterator = createAsyncIterator

// When the object provided to `createAsyncIterator` is not AsyncIterable but is
// sync Iterable, this simple wrapper is created.
function AsyncFromSyncIterator(iterator) {
  this._i = iterator
}

// Note: all AsyncIterators are themselves AsyncIterable.
AsyncFromSyncIterator.prototype[$$asyncIterator] = function() {
  return this
}

// A simple state-machine determines the IteratorResult returned, yielding
// each value in the Array-like object in order of their indicies.
AsyncFromSyncIterator.prototype.next = function() {
  var step = this._i.next()
  return Promise.resolve(step.value).then(function(value) {
    return { value: value, done: step.done }
  })
}

/**
 * Given an object which either implements the AsyncIterable protocol or is
 * Array-like, iterate over it, calling the `callback` at each iteration.
 *
 * Use `forAwaitEach` where you would expect to use a `for-await-of` loop.
 *
 * Similar to [Array#forEach][], the `callback` function accepts three
 * arguments, and is provided with `thisArg` as the calling context.
 *
 * > Note: Using `forAwaitEach` requires the existence of `Promise`.
 * > While `Promise` has been available in modern browsers for a number of
 * > years, legacy browsers (like IE 11) may require a polyfill.
 *
 * @example
 *
 * var forAwaitEach = require('iterall').forAwaitEach
 *
 * forAwaitEach(myIterable, function (value, index, iterable) {
 *   console.log(value, index, iterable === myIterable)
 * })
 *
 * @example
 *
 * // ES2017:
 * for await (let value of myAsyncIterable) {
 *   console.log(await doSomethingAsync(value))
 * }
 * console.log('done')
 *
 * // Any JavaScript environment:
 * forAwaitEach(myAsyncIterable, function (value) {
 *   return doSomethingAsync(value).then(console.log)
 * }).then(function () {
 *   console.log('done')
 * })
 *
 * @template T the type of each iterated value
 * @param {AsyncIterable<T>|Iterable<Promise<T> | T>|{ length: number }} source
 *   The AsyncIterable or array to iterate over.
 * @param {function(T, number, object)} callback
 *   Function to execute for each iteration, taking up to three arguments
 * @param [thisArg]
 *   Optional. Value to use as `this` when executing `callback`.
 */
function forAwaitEach(source, callback, thisArg) {
  var asyncIterator = createAsyncIterator(source)
  if (asyncIterator) {
    var i = 0
    function next() {
      return asyncIterator.next().then(function(step) {
        if (!step.done) {
          return Promise.resolve(
            callback.call(thisArg, step.value, i++, source)
          ).then(next)
        }
      })
    }
    return next()
  }
}
exports.forAwaitEach = forAwaitEach


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = find;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function find(list, predicate) {
  for (var i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      return list[i];
    }
  }
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyMap;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * for each value in the array.
 *
 * This provides a convenient lookup for the array items if the key function
 * produces unique results.
 *
 *     const phoneBook = [
 *       { name: 'Jon', num: '555-1234' },
 *       { name: 'Jenny', num: '867-5309' }
 *     ]
 *
 *     // { Jon: { name: 'Jon', num: '555-1234' },
 *     //   Jenny: { name: 'Jenny', num: '867-5309' } }
 *     const entriesByName = keyMap(
 *       phoneBook,
 *       entry => entry.name
 *     )
 *
 *     // { name: 'Jenny', num: '857-6309' }
 *     const jennyEntry = entriesByName['Jenny']
 *
 */
function keyMap(list, keyFn) {
  return list.reduce(function (map, item) {
    return map[keyFn(item)] = item, map;
  }, Object.create(null));
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(17)
  , IE8_DOM_DEFINE = __webpack_require__(118)
  , toPrimitive    = __webpack_require__(119)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(18) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  try {
    if (loc) {
      this.lineNumber = line;

      // Work around issue under safari where we can't directly set the column value
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(this, 'column', {
          value: column,
          enumerable: true
        });
      } else {
        this.column = column;
      }
    }
  } catch (nop) {
    /* Ignore if the browser is very particular */
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFbkcsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUNoQyxNQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUc7TUFDdEIsSUFBSSxZQUFBO01BQ0osTUFBTSxZQUFBLENBQUM7QUFDWCxNQUFJLEdBQUcsRUFBRTtBQUNQLFFBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN0QixVQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7O0FBRTFCLFdBQU8sSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7R0FDeEM7O0FBRUQsTUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBRzFELE9BQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ2hELFFBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDOUM7OztBQUdELE1BQUksS0FBSyxDQUFDLGlCQUFpQixFQUFFO0FBQzNCLFNBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7R0FDMUM7O0FBRUQsTUFBSTtBQUNGLFFBQUksR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Ozs7QUFJdkIsVUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQ3pCLGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUNwQyxlQUFLLEVBQUUsTUFBTTtBQUNiLG9CQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7T0FDSixNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7T0FDdEI7S0FDRjtHQUNGLENBQUMsT0FBTyxHQUFHLEVBQUU7O0dBRWI7Q0FDRjs7QUFFRCxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7O3FCQUVuQixTQUFTIiwiZmlsZSI6ImV4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3QgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIGxldCBsb2MgPSBub2RlICYmIG5vZGUubG9jLFxuICAgICAgbGluZSxcbiAgICAgIGNvbHVtbjtcbiAgaWYgKGxvYykge1xuICAgIGxpbmUgPSBsb2Muc3RhcnQubGluZTtcbiAgICBjb2x1bW4gPSBsb2Muc3RhcnQuY29sdW1uO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBjb2x1bW47XG4gIH1cblxuICBsZXQgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRXhjZXB0aW9uKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKGxvYykge1xuICAgICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcblxuICAgICAgLy8gV29yayBhcm91bmQgaXNzdWUgdW5kZXIgc2FmYXJpIHdoZXJlIHdlIGNhbid0IGRpcmVjdGx5IHNldCB0aGUgY29sdW1uIHZhbHVlXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NvbHVtbicsIHtcbiAgICAgICAgICB2YWx1ZTogY29sdW1uLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKG5vcCkge1xuICAgIC8qIElnbm9yZSBpZiB0aGUgYnJvd3NlciBpcyB2ZXJ5IHBhcnRpY3VsYXIgKi9cbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEV4Y2VwdGlvbjtcbiJdfQ==


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQLError = GraphQLError;

var _location = __webpack_require__(48);

/**
 * A GraphQLError describes an Error found during the parse, validate, or
 * execute phases of performing a GraphQL operation. In addition to a message
 * and stack trace, it also includes information about the locations in a
 * GraphQL document and/or execution result that correspond to the Error.
 */
function GraphQLError( // eslint-disable-line no-redeclare
message, nodes, source, positions, path, originalError) {
  // Compute locations in the source for the given nodes/positions.
  var _source = source;
  if (!_source && nodes && nodes.length > 0) {
    var node = nodes[0];
    _source = node && node.loc && node.loc.source;
  }

  var _positions = positions;
  if (!_positions && nodes) {
    _positions = nodes.filter(function (node) {
      return Boolean(node.loc);
    }).map(function (node) {
      return node.loc.start;
    });
  }
  if (_positions && _positions.length === 0) {
    _positions = undefined;
  }

  var _locations = void 0;
  var _source2 = _source; // seems here Flow need a const to resolve type.
  if (_source2 && _positions) {
    _locations = _positions.map(function (pos) {
      return (0, _location.getLocation)(_source2, pos);
    });
  }

  Object.defineProperties(this, {
    message: {
      value: message,
      // By being enumerable, JSON.stringify will include `message` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: true,
      writable: true
    },
    locations: {
      // Coercing falsey values to undefined ensures they will not be included
      // in JSON.stringify() when not provided.
      value: _locations || undefined,
      // By being enumerable, JSON.stringify will include `locations` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: true
    },
    path: {
      // Coercing falsey values to undefined ensures they will not be included
      // in JSON.stringify() when not provided.
      value: path || undefined,
      // By being enumerable, JSON.stringify will include `path` in the
      // resulting output. This ensures that the simplest possible GraphQL
      // service adheres to the spec.
      enumerable: true
    },
    nodes: {
      value: nodes || undefined
    },
    source: {
      value: _source || undefined
    },
    positions: {
      value: _positions || undefined
    },
    originalError: {
      value: originalError
    }
  });

  // Include (non-enumerable) stack trace.
  if (originalError && originalError.stack) {
    Object.defineProperty(this, 'stack', {
      value: originalError.stack,
      writable: true,
      configurable: true
    });
  } else if (Error.captureStackTrace) {
    Error.captureStackTrace(this, GraphQLError);
  } else {
    Object.defineProperty(this, 'stack', {
      value: Error().stack,
      writable: true,
      configurable: true
    });
  }
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

GraphQLError.prototype = Object.create(Error.prototype, {
  constructor: { value: GraphQLError },
  name: { value: 'GraphQLError' }
});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visit = visit;
exports.visitInParallel = visitInParallel;
exports.visitWithTypeInfo = visitWithTypeInfo;
exports.getVisitFn = getVisitFn;
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var QueryDocumentKeys = exports.QueryDocumentKeys = {
  Name: [],

  Document: ['definitions'],
  OperationDefinition: ['name', 'variableDefinitions', 'directives', 'selectionSet'],
  VariableDefinition: ['variable', 'type', 'defaultValue'],
  Variable: ['name'],
  SelectionSet: ['selections'],
  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
  Argument: ['name', 'value'],

  FragmentSpread: ['name', 'directives'],
  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
  FragmentDefinition: ['name', 'typeCondition', 'directives', 'selectionSet'],

  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ['values'],
  ObjectValue: ['fields'],
  ObjectField: ['name', 'value'],

  Directive: ['name', 'arguments'],

  NamedType: ['name'],
  ListType: ['type'],
  NonNullType: ['type'],

  SchemaDefinition: ['directives', 'operationTypes'],
  OperationTypeDefinition: ['type'],

  ScalarTypeDefinition: ['name', 'directives'],
  ObjectTypeDefinition: ['name', 'interfaces', 'directives', 'fields'],
  FieldDefinition: ['name', 'arguments', 'type', 'directives'],
  InputValueDefinition: ['name', 'type', 'defaultValue', 'directives'],
  InterfaceTypeDefinition: ['name', 'directives', 'fields'],
  UnionTypeDefinition: ['name', 'directives', 'types'],
  EnumTypeDefinition: ['name', 'directives', 'values'],
  EnumValueDefinition: ['name', 'directives'],
  InputObjectTypeDefinition: ['name', 'directives', 'fields'],

  TypeExtensionDefinition: ['definition'],

  DirectiveDefinition: ['name', 'arguments', 'locations']
};

var BREAK = exports.BREAK = {};

/**
 * visit() will walk through an AST using a depth first traversal, calling
 * the visitor's enter function at each node in the traversal, and calling the
 * leave function after visiting that node and all of its child nodes.
 *
 * By returning different values from the enter and leave functions, the
 * behavior of the visitor can be altered, including skipping over a sub-tree of
 * the AST (by returning false), editing the AST by returning a value or null
 * to remove the value, or to stop the whole traversal by returning BREAK.
 *
 * When using visit() to edit an AST, the original AST will not be modified, and
 * a new version of the AST with the changes applied will be returned from the
 * visit function.
 *
 *     const editedAST = visit(ast, {
 *       enter(node, key, parent, path, ancestors) {
 *         // @return
 *         //   undefined: no action
 *         //   false: skip visiting this node
 *         //   visitor.BREAK: stop visiting altogether
 *         //   null: delete this node
 *         //   any value: replace this node with the returned value
 *       },
 *       leave(node, key, parent, path, ancestors) {
 *         // @return
 *         //   undefined: no action
 *         //   false: no action
 *         //   visitor.BREAK: stop visiting altogether
 *         //   null: delete this node
 *         //   any value: replace this node with the returned value
 *       }
 *     });
 *
 * Alternatively to providing enter() and leave() functions, a visitor can
 * instead provide functions named the same as the kinds of AST nodes, or
 * enter/leave visitors at a named key, leading to four permutations of
 * visitor API:
 *
 * 1) Named visitors triggered when entering a node a specific kind.
 *
 *     visit(ast, {
 *       Kind(node) {
 *         // enter the "Kind" node
 *       }
 *     })
 *
 * 2) Named visitors that trigger upon entering and leaving a node of
 *    a specific kind.
 *
 *     visit(ast, {
 *       Kind: {
 *         enter(node) {
 *           // enter the "Kind" node
 *         }
 *         leave(node) {
 *           // leave the "Kind" node
 *         }
 *       }
 *     })
 *
 * 3) Generic visitors that trigger upon entering and leaving any node.
 *
 *     visit(ast, {
 *       enter(node) {
 *         // enter any node
 *       },
 *       leave(node) {
 *         // leave any node
 *       }
 *     })
 *
 * 4) Parallel visitors for entering and leaving nodes of a specific kind.
 *
 *     visit(ast, {
 *       enter: {
 *         Kind(node) {
 *           // enter the "Kind" node
 *         }
 *       },
 *       leave: {
 *         Kind(node) {
 *           // leave the "Kind" node
 *         }
 *       }
 *     })
 */
function visit(root, visitor, keyMap) {
  var visitorKeys = keyMap || QueryDocumentKeys;

  var stack = void 0;
  var inArray = Array.isArray(root);
  var keys = [root];
  var index = -1;
  var edits = [];
  var parent = void 0;
  var path = [];
  var ancestors = [];
  var newRoot = root;

  do {
    index++;
    var isLeaving = index === keys.length;
    var key = void 0;
    var node = void 0;
    var isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path.pop();
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
        } else {
          var clone = {};
          for (var k in node) {
            if (node.hasOwnProperty(k)) {
              clone[k] = node[k];
            }
          }
          node = clone;
        }
        var editOffset = 0;
        for (var ii = 0; ii < edits.length; ii++) {
          var editKey = edits[ii][0];
          var editValue = edits[ii][1];
          if (inArray) {
            editKey -= editOffset;
          }
          if (inArray && editValue === null) {
            node.splice(editKey, 1);
            editOffset++;
          } else {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? inArray ? index : keys[index] : undefined;
      node = parent ? parent[key] : newRoot;
      if (node === null || node === undefined) {
        continue;
      }
      if (parent) {
        path.push(key);
      }
    }

    var result = void 0;
    if (!Array.isArray(node)) {
      if (!isNode(node)) {
        throw new Error('Invalid AST Node: ' + JSON.stringify(node));
      }
      var visitFn = getVisitFn(visitor, node.kind, isLeaving);
      if (visitFn) {
        result = visitFn.call(visitor, node, key, parent, path, ancestors);

        if (result === BREAK) {
          break;
        }

        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== undefined) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (!isLeaving) {
      stack = { inArray: inArray, index: index, keys: keys, edits: edits, prev: stack };
      inArray = Array.isArray(node);
      keys = inArray ? node : visitorKeys[node.kind] || [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }

  return newRoot;
}

function isNode(maybeNode) {
  return maybeNode && typeof maybeNode.kind === 'string';
}

/**
 * Creates a new visitor instance which delegates to many visitors to run in
 * parallel. Each visitor will be visited for each node before moving on.
 *
 * If a prior visitor edits a node, no following visitors will see that node.
 */
function visitInParallel(visitors) {
  var skipping = new Array(visitors.length);

  return {
    enter: function enter(node) {
      for (var i = 0; i < visitors.length; i++) {
        if (!skipping[i]) {
          var fn = getVisitFn(visitors[i], node.kind, /* isLeaving */false);
          if (fn) {
            var result = fn.apply(visitors[i], arguments);
            if (result === false) {
              skipping[i] = node;
            } else if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== undefined) {
              return result;
            }
          }
        }
      }
    },
    leave: function leave(node) {
      for (var i = 0; i < visitors.length; i++) {
        if (!skipping[i]) {
          var fn = getVisitFn(visitors[i], node.kind, /* isLeaving */true);
          if (fn) {
            var result = fn.apply(visitors[i], arguments);
            if (result === BREAK) {
              skipping[i] = BREAK;
            } else if (result !== undefined && result !== false) {
              return result;
            }
          }
        } else if (skipping[i] === node) {
          skipping[i] = null;
        }
      }
    }
  };
}

/**
 * Creates a new visitor instance which maintains a provided TypeInfo instance
 * along with visiting visitor.
 */
function visitWithTypeInfo(typeInfo, visitor) {
  return {
    enter: function enter(node) {
      typeInfo.enter(node);
      var fn = getVisitFn(visitor, node.kind, /* isLeaving */false);
      if (fn) {
        var result = fn.apply(visitor, arguments);
        if (result !== undefined) {
          typeInfo.leave(node);
          if (isNode(result)) {
            typeInfo.enter(result);
          }
        }
        return result;
      }
    },
    leave: function leave(node) {
      var fn = getVisitFn(visitor, node.kind, /* isLeaving */true);
      var result = void 0;
      if (fn) {
        result = fn.apply(visitor, arguments);
      }
      typeInfo.leave(node);
      return result;
    }
  };
}

/**
 * Given a visitor instance, if it is leaving or not, and a node kind, return
 * the function the visitor runtime should call.
 */
function getVisitFn(visitor, kind, isLeaving) {
  var kindVisitor = visitor[kind];
  if (kindVisitor) {
    if (!isLeaving && typeof kindVisitor === 'function') {
      // { Kind() {} }
      return kindVisitor;
    }
    var kindSpecificVisitor = isLeaving ? kindVisitor.leave : kindVisitor.enter;
    if (typeof kindSpecificVisitor === 'function') {
      // { Kind: { enter() {}, leave() {} } }
      return kindSpecificVisitor;
    }
  } else {
    var specificVisitor = isLeaving ? visitor.leave : visitor.enter;
    if (specificVisitor) {
      if (typeof specificVisitor === 'function') {
        // { enter() {}, leave() {} }
        return specificVisitor;
      }
      var specificKindVisitor = specificVisitor[kind];
      if (typeof specificKindVisitor === 'function') {
        // { enter: { Kind() {} }, leave: { Kind() {} } }
        return specificKindVisitor;
      }
    }
  }
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInvalid;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Returns true if a value is undefined, or NaN.
 */
function isInvalid(value) {
  return value === undefined || value !== value;
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valueFromAST = valueFromAST;

var _keyMap = __webpack_require__(21);

var _keyMap2 = _interopRequireDefault(_keyMap);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _isNullish = __webpack_require__(14);

var _isNullish2 = _interopRequireDefault(_isNullish);

var _isInvalid = __webpack_require__(27);

var _isInvalid2 = _interopRequireDefault(_isInvalid);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _definition = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Produces a JavaScript value given a GraphQL Value AST.
 *
 * A GraphQL type must be provided, which will be used to interpret different
 * GraphQL Value literals.
 *
 * Returns `undefined` when the value could not be validly coerced according to
 * the provided type.
 *
 * | GraphQL Value        | JSON Value    |
 * | -------------------- | ------------- |
 * | Input Object         | Object        |
 * | List                 | Array         |
 * | Boolean              | Boolean       |
 * | String               | String        |
 * | Int / Float          | Number        |
 * | Enum Value           | Mixed         |
 * | NullValue            | null          |
 *
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function valueFromAST(valueNode, type, variables) {
  if (!valueNode) {
    // When there is no node, then there is also no value.
    // Importantly, this is different from returning the value null.
    return;
  }

  if (type instanceof _definition.GraphQLNonNull) {
    if (valueNode.kind === Kind.NULL) {
      return; // Invalid: intentionally return no value.
    }
    return valueFromAST(valueNode, type.ofType, variables);
  }

  if (valueNode.kind === Kind.NULL) {
    // This is explicitly returning the value null.
    return null;
  }

  if (valueNode.kind === Kind.VARIABLE) {
    var variableName = valueNode.name.value;
    if (!variables || (0, _isInvalid2.default)(variables[variableName])) {
      // No valid return value.
      return;
    }
    // Note: we're not doing any checking that this variable is correct. We're
    // assuming that this query has been validated and the variable usage here
    // is of the correct type.
    return variables[variableName];
  }

  if (type instanceof _definition.GraphQLList) {
    var itemType = type.ofType;
    if (valueNode.kind === Kind.LIST) {
      var coercedValues = [];
      var itemNodes = valueNode.values;
      for (var i = 0; i < itemNodes.length; i++) {
        if (isMissingVariable(itemNodes[i], variables)) {
          // If an array contains a missing variable, it is either coerced to
          // null or if the item type is non-null, it considered invalid.
          if (itemType instanceof _definition.GraphQLNonNull) {
            return; // Invalid: intentionally return no value.
          }
          coercedValues.push(null);
        } else {
          var itemValue = valueFromAST(itemNodes[i], itemType, variables);
          if ((0, _isInvalid2.default)(itemValue)) {
            return; // Invalid: intentionally return no value.
          }
          coercedValues.push(itemValue);
        }
      }
      return coercedValues;
    }
    var coercedValue = valueFromAST(valueNode, itemType, variables);
    if ((0, _isInvalid2.default)(coercedValue)) {
      return; // Invalid: intentionally return no value.
    }
    return [coercedValue];
  }

  if (type instanceof _definition.GraphQLInputObjectType) {
    if (valueNode.kind !== Kind.OBJECT) {
      return; // Invalid: intentionally return no value.
    }
    var coercedObj = Object.create(null);
    var fields = type.getFields();
    var fieldNodes = (0, _keyMap2.default)(valueNode.fields, function (field) {
      return field.name.value;
    });
    var fieldNames = Object.keys(fields);
    for (var _i = 0; _i < fieldNames.length; _i++) {
      var fieldName = fieldNames[_i];
      var field = fields[fieldName];
      var fieldNode = fieldNodes[fieldName];
      if (!fieldNode || isMissingVariable(fieldNode.value, variables)) {
        if (!(0, _isInvalid2.default)(field.defaultValue)) {
          coercedObj[fieldName] = field.defaultValue;
        } else if (field.type instanceof _definition.GraphQLNonNull) {
          return; // Invalid: intentionally return no value.
        }
        continue;
      }
      var fieldValue = valueFromAST(fieldNode.value, field.type, variables);
      if ((0, _isInvalid2.default)(fieldValue)) {
        return; // Invalid: intentionally return no value.
      }
      coercedObj[fieldName] = fieldValue;
    }
    return coercedObj;
  }

  (0, _invariant2.default)(type instanceof _definition.GraphQLScalarType || type instanceof _definition.GraphQLEnumType, 'Must be input type');

  var parsed = type.parseLiteral(valueNode);
  if ((0, _isNullish2.default)(parsed) && !type.isValidLiteral(valueNode)) {
    // Invalid values represent a failure to parse correctly, in which case
    // no value is returned.
    return;
  }

  return parsed;
}

// Returns true if the provided valueNode is a variable which is not defined
// in the set of variables.
function isMissingVariable(valueNode, variables) {
  return valueNode.kind === Kind.VARIABLE && (!variables || (0, _isInvalid2.default)(variables[valueNode.name.value]));
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(6)
  , core      = __webpack_require__(13)
  , ctx       = __webpack_require__(30)
  , hide      = __webpack_require__(16)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(38);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.parseValue = parseValue;
exports.parseType = parseType;
exports.parseConstValue = parseConstValue;
exports.parseTypeReference = parseTypeReference;
exports.parseNamedType = parseNamedType;

var _source = __webpack_require__(78);

var _error = __webpack_require__(0);

var _lexer = __webpack_require__(49);

var _kinds = __webpack_require__(2);

/**
 * Given a GraphQL source, parses it into a Document.
 * Throws GraphQLError if a syntax error is encountered.
 */


/**
 * Configuration options to control parser behavior
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function parse(source, options) {
  var sourceObj = typeof source === 'string' ? new _source.Source(source) : source;
  if (!(sourceObj instanceof _source.Source)) {
    throw new TypeError('Must provide Source. Received: ' + String(sourceObj));
  }
  var lexer = (0, _lexer.createLexer)(sourceObj, options || {});
  return parseDocument(lexer);
}

/**
 * Given a string containing a GraphQL value (ex. `[42]`), parse the AST for
 * that value.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Values directly and
 * in isolation of complete GraphQL documents.
 *
 * Consider providing the results to the utility function: valueFromAST().
 */
function parseValue(source, options) {
  var sourceObj = typeof source === 'string' ? new _source.Source(source) : source;
  var lexer = (0, _lexer.createLexer)(sourceObj, options || {});
  expect(lexer, _lexer.TokenKind.SOF);
  var value = parseValueLiteral(lexer, false);
  expect(lexer, _lexer.TokenKind.EOF);
  return value;
}

/**
 * Given a string containing a GraphQL Type (ex. `[Int!]`), parse the AST for
 * that type.
 * Throws GraphQLError if a syntax error is encountered.
 *
 * This is useful within tools that operate upon GraphQL Types directly and
 * in isolation of complete GraphQL documents.
 *
 * Consider providing the results to the utility function: typeFromAST().
 */
function parseType(source, options) {
  var sourceObj = typeof source === 'string' ? new _source.Source(source) : source;
  var lexer = (0, _lexer.createLexer)(sourceObj, options || {});
  expect(lexer, _lexer.TokenKind.SOF);
  var type = parseTypeReference(lexer);
  expect(lexer, _lexer.TokenKind.EOF);
  return type;
}

/**
 * Converts a name lex token into a name parse node.
 */
function parseName(lexer) {
  var token = expect(lexer, _lexer.TokenKind.NAME);
  return {
    kind: _kinds.NAME,
    value: token.value,
    loc: loc(lexer, token)
  };
}

// Implements the parsing rules in the Document section.

/**
 * Document : Definition+
 */
function parseDocument(lexer) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.SOF);
  var definitions = [];
  do {
    definitions.push(parseDefinition(lexer));
  } while (!skip(lexer, _lexer.TokenKind.EOF));

  return {
    kind: _kinds.DOCUMENT,
    definitions: definitions,
    loc: loc(lexer, start)
  };
}

/**
 * Definition :
 *   - OperationDefinition
 *   - FragmentDefinition
 *   - TypeSystemDefinition
 */
function parseDefinition(lexer) {
  if (peek(lexer, _lexer.TokenKind.BRACE_L)) {
    return parseOperationDefinition(lexer);
  }

  if (peek(lexer, _lexer.TokenKind.NAME)) {
    switch (lexer.token.value) {
      // Note: subscription is an experimental non-spec addition.
      case 'query':
      case 'mutation':
      case 'subscription':
        return parseOperationDefinition(lexer);

      case 'fragment':
        return parseFragmentDefinition(lexer);

      // Note: the Type System IDL is an experimental non-spec addition.
      case 'schema':
      case 'scalar':
      case 'type':
      case 'interface':
      case 'union':
      case 'enum':
      case 'input':
      case 'extend':
      case 'directive':
        return parseTypeSystemDefinition(lexer);
    }
  }

  throw unexpected(lexer);
}

// Implements the parsing rules in the Operations section.

/**
 * OperationDefinition :
 *  - SelectionSet
 *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
 */
function parseOperationDefinition(lexer) {
  var start = lexer.token;
  if (peek(lexer, _lexer.TokenKind.BRACE_L)) {
    return {
      kind: _kinds.OPERATION_DEFINITION,
      operation: 'query',
      name: null,
      variableDefinitions: null,
      directives: [],
      selectionSet: parseSelectionSet(lexer),
      loc: loc(lexer, start)
    };
  }
  var operation = parseOperationType(lexer);
  var name = void 0;
  if (peek(lexer, _lexer.TokenKind.NAME)) {
    name = parseName(lexer);
  }
  return {
    kind: _kinds.OPERATION_DEFINITION,
    operation: operation,
    name: name,
    variableDefinitions: parseVariableDefinitions(lexer),
    directives: parseDirectives(lexer),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}

/**
 * OperationType : one of query mutation subscription
 */
function parseOperationType(lexer) {
  var operationToken = expect(lexer, _lexer.TokenKind.NAME);
  switch (operationToken.value) {
    case 'query':
      return 'query';
    case 'mutation':
      return 'mutation';
    // Note: subscription is an experimental non-spec addition.
    case 'subscription':
      return 'subscription';
  }

  throw unexpected(lexer, operationToken);
}

/**
 * VariableDefinitions : ( VariableDefinition+ )
 */
function parseVariableDefinitions(lexer) {
  return peek(lexer, _lexer.TokenKind.PAREN_L) ? many(lexer, _lexer.TokenKind.PAREN_L, parseVariableDefinition, _lexer.TokenKind.PAREN_R) : [];
}

/**
 * VariableDefinition : Variable : Type DefaultValue?
 */
function parseVariableDefinition(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds.VARIABLE_DEFINITION,
    variable: parseVariable(lexer),
    type: (expect(lexer, _lexer.TokenKind.COLON), parseTypeReference(lexer)),
    defaultValue: skip(lexer, _lexer.TokenKind.EQUALS) ? parseValueLiteral(lexer, true) : null,
    loc: loc(lexer, start)
  };
}

/**
 * Variable : $ Name
 */
function parseVariable(lexer) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.DOLLAR);
  return {
    kind: _kinds.VARIABLE,
    name: parseName(lexer),
    loc: loc(lexer, start)
  };
}

/**
 * SelectionSet : { Selection+ }
 */
function parseSelectionSet(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds.SELECTION_SET,
    selections: many(lexer, _lexer.TokenKind.BRACE_L, parseSelection, _lexer.TokenKind.BRACE_R),
    loc: loc(lexer, start)
  };
}

/**
 * Selection :
 *   - Field
 *   - FragmentSpread
 *   - InlineFragment
 */
function parseSelection(lexer) {
  return peek(lexer, _lexer.TokenKind.SPREAD) ? parseFragment(lexer) : parseField(lexer);
}

/**
 * Field : Alias? Name Arguments? Directives? SelectionSet?
 *
 * Alias : Name :
 */
function parseField(lexer) {
  var start = lexer.token;

  var nameOrAlias = parseName(lexer);
  var alias = void 0;
  var name = void 0;
  if (skip(lexer, _lexer.TokenKind.COLON)) {
    alias = nameOrAlias;
    name = parseName(lexer);
  } else {
    alias = null;
    name = nameOrAlias;
  }

  return {
    kind: _kinds.FIELD,
    alias: alias,
    name: name,
    arguments: parseArguments(lexer),
    directives: parseDirectives(lexer),
    selectionSet: peek(lexer, _lexer.TokenKind.BRACE_L) ? parseSelectionSet(lexer) : null,
    loc: loc(lexer, start)
  };
}

/**
 * Arguments : ( Argument+ )
 */
function parseArguments(lexer) {
  return peek(lexer, _lexer.TokenKind.PAREN_L) ? many(lexer, _lexer.TokenKind.PAREN_L, parseArgument, _lexer.TokenKind.PAREN_R) : [];
}

/**
 * Argument : Name : Value
 */
function parseArgument(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds.ARGUMENT,
    name: parseName(lexer),
    value: (expect(lexer, _lexer.TokenKind.COLON), parseValueLiteral(lexer, false)),
    loc: loc(lexer, start)
  };
}

// Implements the parsing rules in the Fragments section.

/**
 * Corresponds to both FragmentSpread and InlineFragment in the spec.
 *
 * FragmentSpread : ... FragmentName Directives?
 *
 * InlineFragment : ... TypeCondition? Directives? SelectionSet
 */
function parseFragment(lexer) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.SPREAD);
  if (peek(lexer, _lexer.TokenKind.NAME) && lexer.token.value !== 'on') {
    return {
      kind: _kinds.FRAGMENT_SPREAD,
      name: parseFragmentName(lexer),
      directives: parseDirectives(lexer),
      loc: loc(lexer, start)
    };
  }
  var typeCondition = null;
  if (lexer.token.value === 'on') {
    lexer.advance();
    typeCondition = parseNamedType(lexer);
  }
  return {
    kind: _kinds.INLINE_FRAGMENT,
    typeCondition: typeCondition,
    directives: parseDirectives(lexer),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}

/**
 * FragmentDefinition :
 *   - fragment FragmentName on TypeCondition Directives? SelectionSet
 *
 * TypeCondition : NamedType
 */
function parseFragmentDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'fragment');
  return {
    kind: _kinds.FRAGMENT_DEFINITION,
    name: parseFragmentName(lexer),
    typeCondition: (expectKeyword(lexer, 'on'), parseNamedType(lexer)),
    directives: parseDirectives(lexer),
    selectionSet: parseSelectionSet(lexer),
    loc: loc(lexer, start)
  };
}

/**
 * FragmentName : Name but not `on`
 */
function parseFragmentName(lexer) {
  if (lexer.token.value === 'on') {
    throw unexpected(lexer);
  }
  return parseName(lexer);
}

// Implements the parsing rules in the Values section.

/**
 * Value[Const] :
 *   - [~Const] Variable
 *   - IntValue
 *   - FloatValue
 *   - StringValue
 *   - BooleanValue
 *   - NullValue
 *   - EnumValue
 *   - ListValue[?Const]
 *   - ObjectValue[?Const]
 *
 * BooleanValue : one of `true` `false`
 *
 * NullValue : `null`
 *
 * EnumValue : Name but not `true`, `false` or `null`
 */
function parseValueLiteral(lexer, isConst) {
  var token = lexer.token;
  switch (token.kind) {
    case _lexer.TokenKind.BRACKET_L:
      return parseList(lexer, isConst);
    case _lexer.TokenKind.BRACE_L:
      return parseObject(lexer, isConst);
    case _lexer.TokenKind.INT:
      lexer.advance();
      return {
        kind: _kinds.INT,
        value: token.value,
        loc: loc(lexer, token)
      };
    case _lexer.TokenKind.FLOAT:
      lexer.advance();
      return {
        kind: _kinds.FLOAT,
        value: token.value,
        loc: loc(lexer, token)
      };
    case _lexer.TokenKind.STRING:
      lexer.advance();
      return {
        kind: _kinds.STRING,
        value: token.value,
        loc: loc(lexer, token)
      };
    case _lexer.TokenKind.NAME:
      if (token.value === 'true' || token.value === 'false') {
        lexer.advance();
        return {
          kind: _kinds.BOOLEAN,
          value: token.value === 'true',
          loc: loc(lexer, token)
        };
      } else if (token.value === 'null') {
        lexer.advance();
        return {
          kind: _kinds.NULL,
          loc: loc(lexer, token)
        };
      }
      lexer.advance();
      return {
        kind: _kinds.ENUM,
        value: token.value,
        loc: loc(lexer, token)
      };
    case _lexer.TokenKind.DOLLAR:
      if (!isConst) {
        return parseVariable(lexer);
      }
      break;
  }
  throw unexpected(lexer);
}

function parseConstValue(lexer) {
  return parseValueLiteral(lexer, true);
}

function parseValueValue(lexer) {
  return parseValueLiteral(lexer, false);
}

/**
 * ListValue[Const] :
 *   - [ ]
 *   - [ Value[?Const]+ ]
 */
function parseList(lexer, isConst) {
  var start = lexer.token;
  var item = isConst ? parseConstValue : parseValueValue;
  return {
    kind: _kinds.LIST,
    values: any(lexer, _lexer.TokenKind.BRACKET_L, item, _lexer.TokenKind.BRACKET_R),
    loc: loc(lexer, start)
  };
}

/**
 * ObjectValue[Const] :
 *   - { }
 *   - { ObjectField[?Const]+ }
 */
function parseObject(lexer, isConst) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.BRACE_L);
  var fields = [];
  while (!skip(lexer, _lexer.TokenKind.BRACE_R)) {
    fields.push(parseObjectField(lexer, isConst));
  }
  return {
    kind: _kinds.OBJECT,
    fields: fields,
    loc: loc(lexer, start)
  };
}

/**
 * ObjectField[Const] : Name : Value[?Const]
 */
function parseObjectField(lexer, isConst) {
  var start = lexer.token;
  return {
    kind: _kinds.OBJECT_FIELD,
    name: parseName(lexer),
    value: (expect(lexer, _lexer.TokenKind.COLON), parseValueLiteral(lexer, isConst)),
    loc: loc(lexer, start)
  };
}

// Implements the parsing rules in the Directives section.

/**
 * Directives : Directive+
 */
function parseDirectives(lexer) {
  var directives = [];
  while (peek(lexer, _lexer.TokenKind.AT)) {
    directives.push(parseDirective(lexer));
  }
  return directives;
}

/**
 * Directive : @ Name Arguments?
 */
function parseDirective(lexer) {
  var start = lexer.token;
  expect(lexer, _lexer.TokenKind.AT);
  return {
    kind: _kinds.DIRECTIVE,
    name: parseName(lexer),
    arguments: parseArguments(lexer),
    loc: loc(lexer, start)
  };
}

// Implements the parsing rules in the Types section.

/**
 * Type :
 *   - NamedType
 *   - ListType
 *   - NonNullType
 */
function parseTypeReference(lexer) {
  var start = lexer.token;
  var type = void 0;
  if (skip(lexer, _lexer.TokenKind.BRACKET_L)) {
    type = parseTypeReference(lexer);
    expect(lexer, _lexer.TokenKind.BRACKET_R);
    type = {
      kind: _kinds.LIST_TYPE,
      type: type,
      loc: loc(lexer, start)
    };
  } else {
    type = parseNamedType(lexer);
  }
  if (skip(lexer, _lexer.TokenKind.BANG)) {
    return {
      kind: _kinds.NON_NULL_TYPE,
      type: type,
      loc: loc(lexer, start)
    };
  }
  return type;
}

/**
 * NamedType : Name
 */
function parseNamedType(lexer) {
  var start = lexer.token;
  return {
    kind: _kinds.NAMED_TYPE,
    name: parseName(lexer),
    loc: loc(lexer, start)
  };
}

// Implements the parsing rules in the Type Definition section.

/**
 * TypeSystemDefinition :
 *   - SchemaDefinition
 *   - TypeDefinition
 *   - TypeExtensionDefinition
 *   - DirectiveDefinition
 *
 * TypeDefinition :
 *   - ScalarTypeDefinition
 *   - ObjectTypeDefinition
 *   - InterfaceTypeDefinition
 *   - UnionTypeDefinition
 *   - EnumTypeDefinition
 *   - InputObjectTypeDefinition
 */
function parseTypeSystemDefinition(lexer) {
  if (peek(lexer, _lexer.TokenKind.NAME)) {
    switch (lexer.token.value) {
      case 'schema':
        return parseSchemaDefinition(lexer);
      case 'scalar':
        return parseScalarTypeDefinition(lexer);
      case 'type':
        return parseObjectTypeDefinition(lexer);
      case 'interface':
        return parseInterfaceTypeDefinition(lexer);
      case 'union':
        return parseUnionTypeDefinition(lexer);
      case 'enum':
        return parseEnumTypeDefinition(lexer);
      case 'input':
        return parseInputObjectTypeDefinition(lexer);
      case 'extend':
        return parseTypeExtensionDefinition(lexer);
      case 'directive':
        return parseDirectiveDefinition(lexer);
    }
  }

  throw unexpected(lexer);
}

/**
 * SchemaDefinition : schema Directives? { OperationTypeDefinition+ }
 *
 * OperationTypeDefinition : OperationType : NamedType
 */
function parseSchemaDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'schema');
  var directives = parseDirectives(lexer);
  var operationTypes = many(lexer, _lexer.TokenKind.BRACE_L, parseOperationTypeDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.SCHEMA_DEFINITION,
    directives: directives,
    operationTypes: operationTypes,
    loc: loc(lexer, start)
  };
}

function parseOperationTypeDefinition(lexer) {
  var start = lexer.token;
  var operation = parseOperationType(lexer);
  expect(lexer, _lexer.TokenKind.COLON);
  var type = parseNamedType(lexer);
  return {
    kind: _kinds.OPERATION_TYPE_DEFINITION,
    operation: operation,
    type: type,
    loc: loc(lexer, start)
  };
}

/**
 * ScalarTypeDefinition : scalar Name Directives?
 */
function parseScalarTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'scalar');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  return {
    kind: _kinds.SCALAR_TYPE_DEFINITION,
    name: name,
    directives: directives,
    loc: loc(lexer, start)
  };
}

/**
 * ObjectTypeDefinition :
 *   - type Name ImplementsInterfaces? Directives? { FieldDefinition+ }
 */
function parseObjectTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'type');
  var name = parseName(lexer);
  var interfaces = parseImplementsInterfaces(lexer);
  var directives = parseDirectives(lexer);
  var fields = any(lexer, _lexer.TokenKind.BRACE_L, parseFieldDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.OBJECT_TYPE_DEFINITION,
    name: name,
    interfaces: interfaces,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}

/**
 * ImplementsInterfaces : implements NamedType+
 */
function parseImplementsInterfaces(lexer) {
  var types = [];
  if (lexer.token.value === 'implements') {
    lexer.advance();
    do {
      types.push(parseNamedType(lexer));
    } while (peek(lexer, _lexer.TokenKind.NAME));
  }
  return types;
}

/**
 * FieldDefinition : Name ArgumentsDefinition? : Type Directives?
 */
function parseFieldDefinition(lexer) {
  var start = lexer.token;
  var name = parseName(lexer);
  var args = parseArgumentDefs(lexer);
  expect(lexer, _lexer.TokenKind.COLON);
  var type = parseTypeReference(lexer);
  var directives = parseDirectives(lexer);
  return {
    kind: _kinds.FIELD_DEFINITION,
    name: name,
    arguments: args,
    type: type,
    directives: directives,
    loc: loc(lexer, start)
  };
}

/**
 * ArgumentsDefinition : ( InputValueDefinition+ )
 */
function parseArgumentDefs(lexer) {
  if (!peek(lexer, _lexer.TokenKind.PAREN_L)) {
    return [];
  }
  return many(lexer, _lexer.TokenKind.PAREN_L, parseInputValueDef, _lexer.TokenKind.PAREN_R);
}

/**
 * InputValueDefinition : Name : Type DefaultValue? Directives?
 */
function parseInputValueDef(lexer) {
  var start = lexer.token;
  var name = parseName(lexer);
  expect(lexer, _lexer.TokenKind.COLON);
  var type = parseTypeReference(lexer);
  var defaultValue = null;
  if (skip(lexer, _lexer.TokenKind.EQUALS)) {
    defaultValue = parseConstValue(lexer);
  }
  var directives = parseDirectives(lexer);
  return {
    kind: _kinds.INPUT_VALUE_DEFINITION,
    name: name,
    type: type,
    defaultValue: defaultValue,
    directives: directives,
    loc: loc(lexer, start)
  };
}

/**
 * InterfaceTypeDefinition : interface Name Directives? { FieldDefinition+ }
 */
function parseInterfaceTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'interface');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  var fields = any(lexer, _lexer.TokenKind.BRACE_L, parseFieldDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.INTERFACE_TYPE_DEFINITION,
    name: name,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}

/**
 * UnionTypeDefinition : union Name Directives? = UnionMembers
 */
function parseUnionTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'union');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  expect(lexer, _lexer.TokenKind.EQUALS);
  var types = parseUnionMembers(lexer);
  return {
    kind: _kinds.UNION_TYPE_DEFINITION,
    name: name,
    directives: directives,
    types: types,
    loc: loc(lexer, start)
  };
}

/**
 * UnionMembers :
 *   - `|`? NamedType
 *   - UnionMembers | NamedType
 */
function parseUnionMembers(lexer) {
  // Optional leading pipe
  skip(lexer, _lexer.TokenKind.PIPE);
  var members = [];
  do {
    members.push(parseNamedType(lexer));
  } while (skip(lexer, _lexer.TokenKind.PIPE));
  return members;
}

/**
 * EnumTypeDefinition : enum Name Directives? { EnumValueDefinition+ }
 */
function parseEnumTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'enum');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  var values = many(lexer, _lexer.TokenKind.BRACE_L, parseEnumValueDefinition, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.ENUM_TYPE_DEFINITION,
    name: name,
    directives: directives,
    values: values,
    loc: loc(lexer, start)
  };
}

/**
 * EnumValueDefinition : EnumValue Directives?
 *
 * EnumValue : Name
 */
function parseEnumValueDefinition(lexer) {
  var start = lexer.token;
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  return {
    kind: _kinds.ENUM_VALUE_DEFINITION,
    name: name,
    directives: directives,
    loc: loc(lexer, start)
  };
}

/**
 * InputObjectTypeDefinition : input Name Directives? { InputValueDefinition+ }
 */
function parseInputObjectTypeDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'input');
  var name = parseName(lexer);
  var directives = parseDirectives(lexer);
  var fields = any(lexer, _lexer.TokenKind.BRACE_L, parseInputValueDef, _lexer.TokenKind.BRACE_R);
  return {
    kind: _kinds.INPUT_OBJECT_TYPE_DEFINITION,
    name: name,
    directives: directives,
    fields: fields,
    loc: loc(lexer, start)
  };
}

/**
 * TypeExtensionDefinition : extend ObjectTypeDefinition
 */
function parseTypeExtensionDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'extend');
  var definition = parseObjectTypeDefinition(lexer);
  return {
    kind: _kinds.TYPE_EXTENSION_DEFINITION,
    definition: definition,
    loc: loc(lexer, start)
  };
}

/**
 * DirectiveDefinition :
 *   - directive @ Name ArgumentsDefinition? on DirectiveLocations
 */
function parseDirectiveDefinition(lexer) {
  var start = lexer.token;
  expectKeyword(lexer, 'directive');
  expect(lexer, _lexer.TokenKind.AT);
  var name = parseName(lexer);
  var args = parseArgumentDefs(lexer);
  expectKeyword(lexer, 'on');
  var locations = parseDirectiveLocations(lexer);
  return {
    kind: _kinds.DIRECTIVE_DEFINITION,
    name: name,
    arguments: args,
    locations: locations,
    loc: loc(lexer, start)
  };
}

/**
 * DirectiveLocations :
 *   - `|`? Name
 *   - DirectiveLocations | Name
 */
function parseDirectiveLocations(lexer) {
  // Optional leading pipe
  skip(lexer, _lexer.TokenKind.PIPE);
  var locations = [];
  do {
    locations.push(parseName(lexer));
  } while (skip(lexer, _lexer.TokenKind.PIPE));
  return locations;
}

// Core parsing utility functions

/**
 * Returns a location object, used to identify the place in
 * the source that created a given parsed object.
 */
function loc(lexer, startToken) {
  if (!lexer.options.noLocation) {
    return new Loc(startToken, lexer.lastToken, lexer.source);
  }
}

function Loc(startToken, endToken, source) {
  this.start = startToken.start;
  this.end = endToken.end;
  this.startToken = startToken;
  this.endToken = endToken;
  this.source = source;
}

// Print a simplified form when appearing in JSON/util.inspect.
Loc.prototype.toJSON = Loc.prototype.inspect = function toJSON() {
  return { start: this.start, end: this.end };
};

/**
 * Determines if the next token is of a given kind
 */
function peek(lexer, kind) {
  return lexer.token.kind === kind;
}

/**
 * If the next token is of the given kind, return true after advancing
 * the lexer. Otherwise, do not change the parser state and return false.
 */
function skip(lexer, kind) {
  var match = lexer.token.kind === kind;
  if (match) {
    lexer.advance();
  }
  return match;
}

/**
 * If the next token is of the given kind, return that token after advancing
 * the lexer. Otherwise, do not change the parser state and throw an error.
 */
function expect(lexer, kind) {
  var token = lexer.token;
  if (token.kind === kind) {
    lexer.advance();
    return token;
  }
  throw (0, _error.syntaxError)(lexer.source, token.start, 'Expected ' + kind + ', found ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * If the next token is a keyword with the given value, return that token after
 * advancing the lexer. Otherwise, do not change the parser state and return
 * false.
 */
function expectKeyword(lexer, value) {
  var token = lexer.token;
  if (token.kind === _lexer.TokenKind.NAME && token.value === value) {
    lexer.advance();
    return token;
  }
  throw (0, _error.syntaxError)(lexer.source, token.start, 'Expected "' + value + '", found ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * Helper function for creating an error when an unexpected lexed token
 * is encountered.
 */
function unexpected(lexer, atToken) {
  var token = atToken || lexer.token;
  return (0, _error.syntaxError)(lexer.source, token.start, 'Unexpected ' + (0, _lexer.getTokenDesc)(token));
}

/**
 * Returns a possibly empty list of parse nodes, determined by
 * the parseFn. This list begins with a lex token of openKind
 * and ends with a lex token of closeKind. Advances the parser
 * to the next lex token after the closing token.
 */
function any(lexer, openKind, parseFn, closeKind) {
  expect(lexer, openKind);
  var nodes = [];
  while (!skip(lexer, closeKind)) {
    nodes.push(parseFn(lexer));
  }
  return nodes;
}

/**
 * Returns a non-empty list of parse nodes, determined by
 * the parseFn. This list begins with a lex token of openKind
 * and ends with a lex token of closeKind. Advances the parser
 * to the next lex token after the closing token.
 */
function many(lexer, openKind, parseFn, closeKind) {
  expect(lexer, openKind);
  var nodes = [parseFn(lexer)];
  while (!skip(lexer, closeKind)) {
    nodes.push(parseFn(lexer));
  }
  return nodes;
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEqualType = isEqualType;
exports.isTypeSubTypeOf = isTypeSubTypeOf;
exports.doTypesOverlap = doTypesOverlap;

var _definition = __webpack_require__(1);

/**
 * Provided two types, return true if the types are equal (invariant).
 */
function isEqualType(typeA, typeB) {
  // Equivalent types are equal.
  if (typeA === typeB) {
    return true;
  }

  // If either type is non-null, the other must also be non-null.
  if (typeA instanceof _definition.GraphQLNonNull && typeB instanceof _definition.GraphQLNonNull) {
    return isEqualType(typeA.ofType, typeB.ofType);
  }

  // If either type is a list, the other must also be a list.
  if (typeA instanceof _definition.GraphQLList && typeB instanceof _definition.GraphQLList) {
    return isEqualType(typeA.ofType, typeB.ofType);
  }

  // Otherwise the types are not equal.
  return false;
}

/**
 * Provided a type and a super type, return true if the first type is either
 * equal or a subset of the second super type (covariant).
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function isTypeSubTypeOf(schema, maybeSubType, superType) {
  // Equivalent type is a valid subtype
  if (maybeSubType === superType) {
    return true;
  }

  // If superType is non-null, maybeSubType must also be non-null.
  if (superType instanceof _definition.GraphQLNonNull) {
    if (maybeSubType instanceof _definition.GraphQLNonNull) {
      return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
    }
    return false;
  } else if (maybeSubType instanceof _definition.GraphQLNonNull) {
    // If superType is nullable, maybeSubType may be non-null or nullable.
    return isTypeSubTypeOf(schema, maybeSubType.ofType, superType);
  }

  // If superType type is a list, maybeSubType type must also be a list.
  if (superType instanceof _definition.GraphQLList) {
    if (maybeSubType instanceof _definition.GraphQLList) {
      return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
    }
    return false;
  } else if (maybeSubType instanceof _definition.GraphQLList) {
    // If superType is not a list, maybeSubType must also be not a list.
    return false;
  }

  // If superType type is an abstract type, maybeSubType type may be a currently
  // possible object type.
  if ((0, _definition.isAbstractType)(superType) && maybeSubType instanceof _definition.GraphQLObjectType && schema.isPossibleType(superType, maybeSubType)) {
    return true;
  }

  // Otherwise, the child type is not a valid subtype of the parent type.
  return false;
}

/**
 * Provided two composite types, determine if they "overlap". Two composite
 * types overlap when the Sets of possible concrete types for each intersect.
 *
 * This is often used to determine if a fragment of a given type could possibly
 * be visited in a context of another type.
 *
 * This function is commutative.
 */
function doTypesOverlap(schema, typeA, typeB) {
  // So flow is aware this is constant
  var _typeB = typeB;

  // Equivalent types overlap
  if (typeA === _typeB) {
    return true;
  }

  if ((0, _definition.isAbstractType)(typeA)) {
    if ((0, _definition.isAbstractType)(_typeB)) {
      // If both types are abstract, then determine if there is any intersection
      // between possible concrete types of each.
      return schema.getPossibleTypes(typeA).some(function (type) {
        return schema.isPossibleType(_typeB, type);
      });
    }
    // Determine if the latter type is a possible concrete type of the former.
    return schema.isPossibleType(typeA, _typeB);
  }

  if ((0, _definition.isAbstractType)(_typeB)) {
    // Determine if the former type is a possible concrete type of the latter.
    return schema.isPossibleType(_typeB, typeA);
  }

  // Otherwise the types do not overlap.
  return false;
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidLiteralValue = isValidLiteralValue;

var _printer = __webpack_require__(7);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _definition = __webpack_require__(1);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _keyMap = __webpack_require__(21);

var _keyMap2 = _interopRequireDefault(_keyMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Utility for validators which determines if a value literal node is valid
 * given an input type.
 *
 * Note that this only validates literal values, variables are assumed to
 * provide values of the correct type.
 */
function isValidLiteralValue(type, valueNode) {
  // A value must be provided if the type is non-null.
  if (type instanceof _definition.GraphQLNonNull) {
    if (!valueNode || valueNode.kind === Kind.NULL) {
      return ['Expected "' + String(type) + '", found null.'];
    }
    return isValidLiteralValue(type.ofType, valueNode);
  }

  if (!valueNode || valueNode.kind === Kind.NULL) {
    return [];
  }

  // This function only tests literals, and assumes variables will provide
  // values of the correct type.
  if (valueNode.kind === Kind.VARIABLE) {
    return [];
  }

  // Lists accept a non-list value as a list of one.
  if (type instanceof _definition.GraphQLList) {
    var itemType = type.ofType;
    if (valueNode.kind === Kind.LIST) {
      return valueNode.values.reduce(function (acc, item, index) {
        var errors = isValidLiteralValue(itemType, item);
        return acc.concat(errors.map(function (error) {
          return 'In element #' + index + ': ' + error;
        }));
      }, []);
    }
    return isValidLiteralValue(itemType, valueNode);
  }

  // Input objects check each defined field and look for undefined fields.
  if (type instanceof _definition.GraphQLInputObjectType) {
    if (valueNode.kind !== Kind.OBJECT) {
      return ['Expected "' + type.name + '", found not an object.'];
    }
    var fields = type.getFields();

    var errors = [];

    // Ensure every provided field is defined.
    var fieldNodes = valueNode.fields;
    fieldNodes.forEach(function (providedFieldNode) {
      if (!fields[providedFieldNode.name.value]) {
        errors.push('In field "' + providedFieldNode.name.value + '": Unknown field.');
      }
    });

    // Ensure every defined field is valid.
    var fieldNodeMap = (0, _keyMap2.default)(fieldNodes, function (fieldNode) {
      return fieldNode.name.value;
    });
    Object.keys(fields).forEach(function (fieldName) {
      var result = isValidLiteralValue(fields[fieldName].type, fieldNodeMap[fieldName] && fieldNodeMap[fieldName].value);
      errors.push.apply(errors, result.map(function (error) {
        return 'In field "' + fieldName + '": ' + error;
      }));
    });

    return errors;
  }

  (0, _invariant2.default)(type instanceof _definition.GraphQLScalarType || type instanceof _definition.GraphQLEnumType, 'Must be input type');

  // Scalars determine if a literal values is valid.
  if (!type.isValidLiteral(valueNode)) {
    return ['Expected type "' + type.name + '", found ' + (0, _printer.print)(valueNode) + '.'];
  }

  return [];
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 37 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(31)
  , document = __webpack_require__(6).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(60)
  , defined = __webpack_require__(42);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 42 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 43 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(62)('keys')
  , uid    = __webpack_require__(63);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(22).f
  , has = __webpack_require__(32)
  , TAG = __webpack_require__(5)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(159)(undefined);
// imports


// module
exports.push([module.i, "body  { font-family:Verdana, Geneva, sans-serif; font-size:10pt; color:#828282; }\r\ntd    { font-family:Verdana, Geneva, sans-serif; font-size:10pt; color:#828282; }\r\n\r\ninput    { font-family:monospace; font-size:10pt; color:#000000; }\r\ninput[type=\\\"submit\\\"] { font-family:Verdana, Geneva, sans-serif; }\r\ntextarea { font-family:monospace; font-size:10pt; color:#000000; }\r\n\r\na:link    { color:#000000; text-decoration:none; }\r\na:visited { color:#828282; text-decoration:none; }\r\n\r\n.home-container {\r\n  width: 960px;\r\n  margin: 0 auto;\r\n}\r\n.news {\r\n  margin-bottom: 0;\r\n  color: #000;\r\n  padding: 5px 20px;\r\n  font-size: 16px;\r\n  background-color: #ff6600;\r\n}\r\n.list {\r\n  margin: 0 auto;\r\n  min-height: 200px;\r\n  background-color: #f6f6ef;\r\n}\r\n.item {\r\n  padding-top: 10px;\r\n  list-style: none;\r\n}\r\n.item > span {\r\n  color: #000000;\r\n  font-size: 14px;\r\n}\r\n.item > h2 {\r\n  display: inline;\r\n  font-weight: 300;\r\n  font-size: 14px;\r\n  color: #000000;\r\n}\r\n.item > h2 > span{\r\n  font-size: 12px;\r\n  color:#828282;\r\n}\r\n.item > p{\r\n  margin: 0 auto;\r\n  padding-top: 5px;\r\n  text-indent: 2em;\r\n  font-weight: 300;\r\n  font-size: 12px;\r\n}", ""]);

// exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(4);
var normalizeHeaderName = __webpack_require__(184);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(74);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(74);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(73)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocation = getLocation;


/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function getLocation(source, position) {
  var lineRegexp = /\r\n|[\n\r]/g;
  var line = 1;
  var column = position + 1;
  var match = void 0;
  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }
  return { line: line, column: column };
}

/**
 * Represents a location in a Source.
 */

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenKind = undefined;
exports.createLexer = createLexer;
exports.getTokenDesc = getTokenDesc;

var _error = __webpack_require__(0);

/**
 * Given a Source object, this returns a Lexer for that source.
 * A Lexer is a stateful stream generator in that every time
 * it is advanced, it returns the next token in the Source. Assuming the
 * source lexes, the final Token emitted by the lexer will be of kind
 * EOF, after which the lexer will repeatedly return the same EOF token
 * whenever called.
 */
function createLexer(source, options) {
  var startOfFileToken = new Tok(SOF, 0, 0, 0, 0, null);
  var lexer = {
    source: source,
    options: options,
    lastToken: startOfFileToken,
    token: startOfFileToken,
    line: 1,
    lineStart: 0,
    advance: advanceLexer
  };
  return lexer;
} /*  /
  /**
   *  Copyright (c) 2015, Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree. An additional grant
   *  of patent rights can be found in the PATENTS file in the same directory.
   */

function advanceLexer() {
  var token = this.lastToken = this.token;
  if (token.kind !== EOF) {
    do {
      token = token.next = readToken(this, token);
    } while (token.kind === COMMENT);
    this.token = token;
  }
  return token;
}

/**
 * The return type of createLexer.
 */


// Each kind of token.
var SOF = '<SOF>';
var EOF = '<EOF>';
var BANG = '!';
var DOLLAR = '$';
var PAREN_L = '(';
var PAREN_R = ')';
var SPREAD = '...';
var COLON = ':';
var EQUALS = '=';
var AT = '@';
var BRACKET_L = '[';
var BRACKET_R = ']';
var BRACE_L = '{';
var PIPE = '|';
var BRACE_R = '}';
var NAME = 'Name';
var INT = 'Int';
var FLOAT = 'Float';
var STRING = 'String';
var COMMENT = 'Comment';

/**
 * An exported enum describing the different kinds of tokens that the
 * lexer emits.
 */
var TokenKind = exports.TokenKind = {
  SOF: SOF,
  EOF: EOF,
  BANG: BANG,
  DOLLAR: DOLLAR,
  PAREN_L: PAREN_L,
  PAREN_R: PAREN_R,
  SPREAD: SPREAD,
  COLON: COLON,
  EQUALS: EQUALS,
  AT: AT,
  BRACKET_L: BRACKET_L,
  BRACKET_R: BRACKET_R,
  BRACE_L: BRACE_L,
  PIPE: PIPE,
  BRACE_R: BRACE_R,
  NAME: NAME,
  INT: INT,
  FLOAT: FLOAT,
  STRING: STRING,
  COMMENT: COMMENT
};

/**
 * A helper function to describe a token as a string for debugging
 */
function getTokenDesc(token) {
  var value = token.value;
  return value ? token.kind + ' "' + value + '"' : token.kind;
}

var charCodeAt = String.prototype.charCodeAt;
var slice = String.prototype.slice;

/**
 * Helper function for constructing the Token object.
 */
function Tok(kind, start, end, line, column, prev, value) {
  this.kind = kind;
  this.start = start;
  this.end = end;
  this.line = line;
  this.column = column;
  this.value = value;
  this.prev = prev;
  this.next = null;
}

// Print a simplified form when appearing in JSON/util.inspect.
Tok.prototype.toJSON = Tok.prototype.inspect = function toJSON() {
  return {
    kind: this.kind,
    value: this.value,
    line: this.line,
    column: this.column
  };
};

function printCharCode(code) {
  return (
    // NaN/undefined represents access beyond the end of the file.
    isNaN(code) ? EOF :
    // Trust JSON for ASCII.
    code < 0x007F ? JSON.stringify(String.fromCharCode(code)) :
    // Otherwise print the escaped form.
    '"\\u' + ('00' + code.toString(16).toUpperCase()).slice(-4) + '"'
  );
}

/**
 * Gets the next token from the source starting at the given position.
 *
 * This skips over whitespace and comments until it finds the next lexable
 * token, then lexes punctuators immediately or calls the appropriate helper
 * function for more complicated tokens.
 */
function readToken(lexer, prev) {
  var source = lexer.source;
  var body = source.body;
  var bodyLength = body.length;

  var position = positionAfterWhitespace(body, prev.end, lexer);
  var line = lexer.line;
  var col = 1 + position - lexer.lineStart;

  if (position >= bodyLength) {
    return new Tok(EOF, bodyLength, bodyLength, line, col, prev);
  }

  var code = charCodeAt.call(body, position);

  // SourceCharacter
  if (code < 0x0020 && code !== 0x0009 && code !== 0x000A && code !== 0x000D) {
    throw (0, _error.syntaxError)(source, position, 'Cannot contain the invalid character ' + printCharCode(code) + '.');
  }

  switch (code) {
    // !
    case 33:
      return new Tok(BANG, position, position + 1, line, col, prev);
    // #
    case 35:
      return readComment(source, position, line, col, prev);
    // $
    case 36:
      return new Tok(DOLLAR, position, position + 1, line, col, prev);
    // (
    case 40:
      return new Tok(PAREN_L, position, position + 1, line, col, prev);
    // )
    case 41:
      return new Tok(PAREN_R, position, position + 1, line, col, prev);
    // .
    case 46:
      if (charCodeAt.call(body, position + 1) === 46 && charCodeAt.call(body, position + 2) === 46) {
        return new Tok(SPREAD, position, position + 3, line, col, prev);
      }
      break;
    // :
    case 58:
      return new Tok(COLON, position, position + 1, line, col, prev);
    // =
    case 61:
      return new Tok(EQUALS, position, position + 1, line, col, prev);
    // @
    case 64:
      return new Tok(AT, position, position + 1, line, col, prev);
    // [
    case 91:
      return new Tok(BRACKET_L, position, position + 1, line, col, prev);
    // ]
    case 93:
      return new Tok(BRACKET_R, position, position + 1, line, col, prev);
    // {
    case 123:
      return new Tok(BRACE_L, position, position + 1, line, col, prev);
    // |
    case 124:
      return new Tok(PIPE, position, position + 1, line, col, prev);
    // }
    case 125:
      return new Tok(BRACE_R, position, position + 1, line, col, prev);
    // A-Z _ a-z
    case 65:case 66:case 67:case 68:case 69:case 70:case 71:case 72:
    case 73:case 74:case 75:case 76:case 77:case 78:case 79:case 80:
    case 81:case 82:case 83:case 84:case 85:case 86:case 87:case 88:
    case 89:case 90:
    case 95:
    case 97:case 98:case 99:case 100:case 101:case 102:case 103:case 104:
    case 105:case 106:case 107:case 108:case 109:case 110:case 111:
    case 112:case 113:case 114:case 115:case 116:case 117:case 118:
    case 119:case 120:case 121:case 122:
      return readName(source, position, line, col, prev);
    // - 0-9
    case 45:
    case 48:case 49:case 50:case 51:case 52:
    case 53:case 54:case 55:case 56:case 57:
      return readNumber(source, position, code, line, col, prev);
    // "
    case 34:
      return readString(source, position, line, col, prev);
  }

  throw (0, _error.syntaxError)(source, position, unexpectedCharacterMessage(code));
}

/**
 * Report a message that an unexpected character was encountered.
 */
function unexpectedCharacterMessage(code) {
  if (code === 39) {
    // '
    return 'Unexpected single quote character (\'), did you mean to use ' + 'a double quote (")?';
  }

  return 'Cannot parse the unexpected character ' + printCharCode(code) + '.';
}

/**
 * Reads from body starting at startPosition until it finds a non-whitespace
 * or commented character, then returns the position of that character for
 * lexing.
 */
function positionAfterWhitespace(body, startPosition, lexer) {
  var bodyLength = body.length;
  var position = startPosition;
  while (position < bodyLength) {
    var code = charCodeAt.call(body, position);
    // tab | space | comma | BOM
    if (code === 9 || code === 32 || code === 44 || code === 0xFEFF) {
      ++position;
    } else if (code === 10) {
      // new line
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      // carriage return
      if (charCodeAt.call(body, position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      ++lexer.line;
      lexer.lineStart = position;
    } else {
      break;
    }
  }
  return position;
}

/**
 * Reads a comment token from the source file.
 *
 * #[\u0009\u0020-\uFFFF]*
 */
function readComment(source, start, line, col, prev) {
  var body = source.body;
  var code = void 0;
  var position = start;

  do {
    code = charCodeAt.call(body, ++position);
  } while (code !== null && (
  // SourceCharacter but not LineTerminator
  code > 0x001F || code === 0x0009));

  return new Tok(COMMENT, start, position, line, col, prev, slice.call(body, start + 1, position));
}

/**
 * Reads a number token from the source file, either a float
 * or an int depending on whether a decimal point appears.
 *
 * Int:   -?(0|[1-9][0-9]*)
 * Float: -?(0|[1-9][0-9]*)(\.[0-9]+)?((E|e)(+|-)?[0-9]+)?
 */
function readNumber(source, start, firstCode, line, col, prev) {
  var body = source.body;
  var code = firstCode;
  var position = start;
  var isFloat = false;

  if (code === 45) {
    // -
    code = charCodeAt.call(body, ++position);
  }

  if (code === 48) {
    // 0
    code = charCodeAt.call(body, ++position);
    if (code >= 48 && code <= 57) {
      throw (0, _error.syntaxError)(source, position, 'Invalid number, unexpected digit after 0: ' + printCharCode(code) + '.');
    }
  } else {
    position = readDigits(source, position, code);
    code = charCodeAt.call(body, position);
  }

  if (code === 46) {
    // .
    isFloat = true;

    code = charCodeAt.call(body, ++position);
    position = readDigits(source, position, code);
    code = charCodeAt.call(body, position);
  }

  if (code === 69 || code === 101) {
    // E e
    isFloat = true;

    code = charCodeAt.call(body, ++position);
    if (code === 43 || code === 45) {
      // + -
      code = charCodeAt.call(body, ++position);
    }
    position = readDigits(source, position, code);
  }

  return new Tok(isFloat ? FLOAT : INT, start, position, line, col, prev, slice.call(body, start, position));
}

/**
 * Returns the new position in the source after reading digits.
 */
function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;
  if (code >= 48 && code <= 57) {
    // 0 - 9
    do {
      code = charCodeAt.call(body, ++position);
    } while (code >= 48 && code <= 57); // 0 - 9
    return position;
  }
  throw (0, _error.syntaxError)(source, position, 'Invalid number, expected digit but got: ' + printCharCode(code) + '.');
}

/**
 * Reads a string token from the source file.
 *
 * "([^"\\\u000A\u000D]|(\\(u[0-9a-fA-F]{4}|["\\/bfnrt])))*"
 */
function readString(source, start, line, col, prev) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = '';

  while (position < body.length && (code = charCodeAt.call(body, position)) !== null &&
  // not LineTerminator
  code !== 0x000A && code !== 0x000D &&
  // not Quote (")
  code !== 34) {
    // SourceCharacter
    if (code < 0x0020 && code !== 0x0009) {
      throw (0, _error.syntaxError)(source, position, 'Invalid character within String: ' + printCharCode(code) + '.');
    }

    ++position;
    if (code === 92) {
      // \
      value += slice.call(body, chunkStart, position - 1);
      code = charCodeAt.call(body, position);
      switch (code) {
        case 34:
          value += '"';break;
        case 47:
          value += '/';break;
        case 92:
          value += '\\';break;
        case 98:
          value += '\b';break;
        case 102:
          value += '\f';break;
        case 110:
          value += '\n';break;
        case 114:
          value += '\r';break;
        case 116:
          value += '\t';break;
        case 117:
          // u
          var charCode = uniCharCode(charCodeAt.call(body, position + 1), charCodeAt.call(body, position + 2), charCodeAt.call(body, position + 3), charCodeAt.call(body, position + 4));
          if (charCode < 0) {
            throw (0, _error.syntaxError)(source, position, 'Invalid character escape sequence: ' + ('\\u' + body.slice(position + 1, position + 5) + '.'));
          }
          value += String.fromCharCode(charCode);
          position += 4;
          break;
        default:
          throw (0, _error.syntaxError)(source, position, 'Invalid character escape sequence: \\' + String.fromCharCode(code) + '.');
      }
      ++position;
      chunkStart = position;
    }
  }

  if (code !== 34) {
    // quote (")
    throw (0, _error.syntaxError)(source, position, 'Unterminated string.');
  }

  value += slice.call(body, chunkStart, position);
  return new Tok(STRING, start, position + 1, line, col, prev, value);
}

/**
 * Converts four hexidecimal chars to the integer that the
 * string represents. For example, uniCharCode('0','0','0','f')
 * will return 15, and uniCharCode('0','0','f','f') returns 255.
 *
 * Returns a negative number on error, if a char was invalid.
 *
 * This is implemented by noting that char2hex() returns -1 on error,
 * which means the result of ORing the char2hex() will also be negative.
 */
function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}

/**
 * Converts a hex character to its integer value.
 * '0' becomes 0, '9' becomes 9
 * 'A' becomes 10, 'F' becomes 15
 * 'a' becomes 10, 'f' becomes 15
 *
 * Returns -1 on error.
 */
function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 : // 0-9
  a >= 65 && a <= 70 ? a - 55 : // A-F
  a >= 97 && a <= 102 ? a - 87 : // a-f
  -1;
}

/**
 * Reads an alphanumeric + underscore name from the source.
 *
 * [_A-Za-z][_0-9A-Za-z]*
 */
function readName(source, position, line, col, prev) {
  var body = source.body;
  var bodyLength = body.length;
  var end = position + 1;
  var code = 0;
  while (end !== bodyLength && (code = charCodeAt.call(body, end)) !== null && (code === 95 || // _
  code >= 48 && code <= 57 || // 0-9
  code >= 65 && code <= 90 || // A-Z
  code >= 97 && code <= 122 // a-z
  )) {
    ++end;
  }
  return new Tok(NAME, position, end, line, col, prev, slice.call(body, position, end));
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertValidName = assertValidName;
exports.formatWarning = formatWarning;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
var ERROR_PREFIX_RX = /^Error: /;

// Silences warnings if an environment flag is enabled
var noNameWarning = Boolean(process && process.env && process.env.GRAPHQL_NO_NAME_WARNING);

// Ensures console warnings are only issued once.
var hasWarnedAboutDunder = false;

/**
 * Upholds the spec rules about naming.
 */
function assertValidName(name, isIntrospection) {
  if (!name || typeof name !== 'string') {
    throw new Error('Must be named. Unexpected name: ' + name + '.');
  }
  if (!isIntrospection && !hasWarnedAboutDunder && !noNameWarning && name.slice(0, 2) === '__') {
    hasWarnedAboutDunder = true;
    /* eslint-disable no-console */
    if (console && console.warn) {
      var error = new Error('Name "' + name + '" must not begin with "__", which is reserved by ' + 'GraphQL introspection. In a future release of graphql this will ' + 'become a hard error.');
      console.warn(formatWarning(error));
    }
    /* eslint-enable no-console */
  }
  if (!NAME_RX.test(name)) {
    throw new Error('Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "' + name + '" does not.');
  }
}

/**
 * Returns a human-readable warning based an the supplied Error object,
 * including stack trace information if available.
 */
function formatWarning(error) {
  var formatted = '';
  var errorString = String(error).replace(ERROR_PREFIX_RX, '');
  var stack = error.stack;
  if (stack) {
    formatted = stack.replace(ERROR_PREFIX_RX, '');
  }
  if (formatted.indexOf(errorString) === -1) {
    formatted = errorString + '\n' + formatted;
  }
  return formatted.trim();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(73)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.astFromValue = astFromValue;

var _iterall = __webpack_require__(19);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _isNullish = __webpack_require__(14);

var _isNullish2 = _interopRequireDefault(_isNullish);

var _isInvalid = __webpack_require__(27);

var _isInvalid2 = _interopRequireDefault(_isInvalid);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _definition = __webpack_require__(1);

var _scalars = __webpack_require__(12);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Produces a GraphQL Value AST given a JavaScript value.
 *
 * A GraphQL type must be provided, which will be used to interpret different
 * JavaScript values.
 *
 * | JSON Value    | GraphQL Value        |
 * | ------------- | -------------------- |
 * | Object        | Input Object         |
 * | Array         | List                 |
 * | Boolean       | Boolean              |
 * | String        | String / Enum Value  |
 * | Number        | Int / Float          |
 * | Mixed         | Enum Value           |
 * | null          | NullValue            |
 *
 */
function astFromValue(value, type) {
  // Ensure flow knows that we treat function params as const.
  var _value = value;

  if (type instanceof _definition.GraphQLNonNull) {
    var astValue = astFromValue(_value, type.ofType);
    if (astValue && astValue.kind === Kind.NULL) {
      return null;
    }
    return astValue;
  }

  // only explicit null, not undefined, NaN
  if (_value === null) {
    return { kind: Kind.NULL };
  }

  // undefined, NaN
  if ((0, _isInvalid2.default)(_value)) {
    return null;
  }

  // Convert JavaScript array to GraphQL list. If the GraphQLType is a list, but
  // the value is not an array, convert the value using the list's item type.
  if (type instanceof _definition.GraphQLList) {
    var itemType = type.ofType;
    if ((0, _iterall.isCollection)(_value)) {
      var valuesNodes = [];
      (0, _iterall.forEach)(_value, function (item) {
        var itemNode = astFromValue(item, itemType);
        if (itemNode) {
          valuesNodes.push(itemNode);
        }
      });
      return { kind: Kind.LIST, values: valuesNodes };
    }
    return astFromValue(_value, itemType);
  }

  // Populate the fields of the input object by creating ASTs from each value
  // in the JavaScript object according to the fields in the input type.
  if (type instanceof _definition.GraphQLInputObjectType) {
    if (_value === null || typeof _value !== 'object') {
      return null;
    }
    var fields = type.getFields();
    var fieldNodes = [];
    Object.keys(fields).forEach(function (fieldName) {
      var fieldType = fields[fieldName].type;
      var fieldValue = astFromValue(_value[fieldName], fieldType);
      if (fieldValue) {
        fieldNodes.push({
          kind: Kind.OBJECT_FIELD,
          name: { kind: Kind.NAME, value: fieldName },
          value: fieldValue
        });
      }
    });
    return { kind: Kind.OBJECT, fields: fieldNodes };
  }

  (0, _invariant2.default)(type instanceof _definition.GraphQLScalarType || type instanceof _definition.GraphQLEnumType, 'Must provide Input Type, cannot use: ' + String(type));

  // Since value is an internally represented value, it must be serialized
  // to an externally represented value before converting into an AST.
  var serialized = type.serialize(_value);
  if ((0, _isNullish2.default)(serialized)) {
    return null;
  }

  // Others serialize based on their corresponding JavaScript scalar types.
  if (typeof serialized === 'boolean') {
    return { kind: Kind.BOOLEAN, value: serialized };
  }

  // JavaScript numbers can be Int or Float values.
  if (typeof serialized === 'number') {
    var stringNum = String(serialized);
    return (/^[0-9]+$/.test(stringNum) ? { kind: Kind.INT, value: stringNum } : { kind: Kind.FLOAT, value: stringNum }
    );
  }

  if (typeof serialized === 'string') {
    // Enum types use Enum literals.
    if (type instanceof _definition.GraphQLEnumType) {
      return { kind: Kind.ENUM, value: serialized };
    }

    // ID types can use Int literals.
    if (type === _scalars.GraphQLID && /^[0-9]+$/.test(serialized)) {
      return { kind: Kind.INT, value: serialized };
    }

    // Use JSON stringify, which uses the same string encoding as GraphQL,
    // then remove the quotes.
    return {
      kind: Kind.STRING,
      value: JSON.stringify(serialized).slice(1, -1)
    };
  }

  throw new TypeError('Cannot convert value to AST: ' + String(serialized));
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeInfo = undefined;

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _definition = __webpack_require__(1);

var _introspection = __webpack_require__(15);

var _typeFromAST = __webpack_require__(11);

var _find = __webpack_require__(20);

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * TypeInfo is a utility class which, given a GraphQL schema, can keep track
 * of the current field and type definitions at any point in a GraphQL document
 * AST during a recursive descent by calling `enter(node)` and `leave(node)`.
 */
var TypeInfo = exports.TypeInfo = function () {
  function TypeInfo(schema,
  // NOTE: this experimental optional second parameter is only needed in order
  // to support non-spec-compliant codebases. You should never need to use it.
  getFieldDefFn) {
    _classCallCheck(this, TypeInfo);

    this._schema = schema;
    this._typeStack = [];
    this._parentTypeStack = [];
    this._inputTypeStack = [];
    this._fieldDefStack = [];
    this._directive = null;
    this._argument = null;
    this._enumValue = null;
    this._getFieldDef = getFieldDefFn || getFieldDef;
  }

  TypeInfo.prototype.getType = function getType() {
    if (this._typeStack.length > 0) {
      return this._typeStack[this._typeStack.length - 1];
    }
  };

  TypeInfo.prototype.getParentType = function getParentType() {
    if (this._parentTypeStack.length > 0) {
      return this._parentTypeStack[this._parentTypeStack.length - 1];
    }
  };

  TypeInfo.prototype.getInputType = function getInputType() {
    if (this._inputTypeStack.length > 0) {
      return this._inputTypeStack[this._inputTypeStack.length - 1];
    }
  };

  TypeInfo.prototype.getFieldDef = function getFieldDef() {
    if (this._fieldDefStack.length > 0) {
      return this._fieldDefStack[this._fieldDefStack.length - 1];
    }
  };

  TypeInfo.prototype.getDirective = function getDirective() {
    return this._directive;
  };

  TypeInfo.prototype.getArgument = function getArgument() {
    return this._argument;
  };

  TypeInfo.prototype.getEnumValue = function getEnumValue() {
    return this._enumValue;
  };

  // Flow does not yet handle this case.


  TypeInfo.prototype.enter = function enter(node /* ASTNode */) {
    var schema = this._schema;
    switch (node.kind) {
      case Kind.SELECTION_SET:
        var namedType = (0, _definition.getNamedType)(this.getType());
        this._parentTypeStack.push((0, _definition.isCompositeType)(namedType) ? namedType : undefined);
        break;
      case Kind.FIELD:
        var parentType = this.getParentType();
        var fieldDef = void 0;
        if (parentType) {
          fieldDef = this._getFieldDef(schema, parentType, node);
        }
        this._fieldDefStack.push(fieldDef);
        this._typeStack.push(fieldDef && fieldDef.type);
        break;
      case Kind.DIRECTIVE:
        this._directive = schema.getDirective(node.name.value);
        break;
      case Kind.OPERATION_DEFINITION:
        var type = void 0;
        if (node.operation === 'query') {
          type = schema.getQueryType();
        } else if (node.operation === 'mutation') {
          type = schema.getMutationType();
        } else if (node.operation === 'subscription') {
          type = schema.getSubscriptionType();
        }
        this._typeStack.push(type);
        break;
      case Kind.INLINE_FRAGMENT:
      case Kind.FRAGMENT_DEFINITION:
        var typeConditionAST = node.typeCondition;
        var outputType = typeConditionAST ? (0, _typeFromAST.typeFromAST)(schema, typeConditionAST) : this.getType();
        this._typeStack.push((0, _definition.isOutputType)(outputType) ? outputType : undefined);
        break;
      case Kind.VARIABLE_DEFINITION:
        var inputType = (0, _typeFromAST.typeFromAST)(schema, node.type);
        this._inputTypeStack.push((0, _definition.isInputType)(inputType) ? inputType : undefined);
        break;
      case Kind.ARGUMENT:
        var argDef = void 0;
        var argType = void 0;
        var fieldOrDirective = this.getDirective() || this.getFieldDef();
        if (fieldOrDirective) {
          argDef = (0, _find2.default)(fieldOrDirective.args, function (arg) {
            return arg.name === node.name.value;
          });
          if (argDef) {
            argType = argDef.type;
          }
        }
        this._argument = argDef;
        this._inputTypeStack.push(argType);
        break;
      case Kind.LIST:
        var listType = (0, _definition.getNullableType)(this.getInputType());
        this._inputTypeStack.push(listType instanceof _definition.GraphQLList ? listType.ofType : undefined);
        break;
      case Kind.OBJECT_FIELD:
        var objectType = (0, _definition.getNamedType)(this.getInputType());
        var fieldType = void 0;
        if (objectType instanceof _definition.GraphQLInputObjectType) {
          var inputField = objectType.getFields()[node.name.value];
          fieldType = inputField ? inputField.type : undefined;
        }
        this._inputTypeStack.push(fieldType);
        break;
      case Kind.ENUM:
        var enumType = (0, _definition.getNamedType)(this.getInputType());
        var enumValue = void 0;
        if (enumType instanceof _definition.GraphQLEnumType) {
          enumValue = enumType.getValue(node.value);
        }
        this._enumValue = enumValue;
        break;
    }
  };

  TypeInfo.prototype.leave = function leave(node) {
    switch (node.kind) {
      case Kind.SELECTION_SET:
        this._parentTypeStack.pop();
        break;
      case Kind.FIELD:
        this._fieldDefStack.pop();
        this._typeStack.pop();
        break;
      case Kind.DIRECTIVE:
        this._directive = null;
        break;
      case Kind.OPERATION_DEFINITION:
      case Kind.INLINE_FRAGMENT:
      case Kind.FRAGMENT_DEFINITION:
        this._typeStack.pop();
        break;
      case Kind.VARIABLE_DEFINITION:
        this._inputTypeStack.pop();
        break;
      case Kind.ARGUMENT:
        this._argument = null;
        this._inputTypeStack.pop();
        break;
      case Kind.LIST:
      case Kind.OBJECT_FIELD:
        this._inputTypeStack.pop();
        break;
      case Kind.ENUM:
        this._enumValue = null;
        break;
    }
  };

  return TypeInfo;
}();

/**
 * Not exactly the same as the executor's definition of getFieldDef, in this
 * statically evaluated environment we do not always have an Object type,
 * and need to handle Interface and Union types.
 */


function getFieldDef(schema, parentType, fieldNode) {
  var name = fieldNode.name.value;
  if (name === _introspection.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _introspection.SchemaMetaFieldDef;
  }
  if (name === _introspection.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _introspection.TypeMetaFieldDef;
  }
  if (name === _introspection.TypeNameMetaFieldDef.name && (0, _definition.isCompositeType)(parentType)) {
    return _introspection.TypeNameMetaFieldDef;
  }
  if (parentType instanceof _definition.GraphQLObjectType || parentType instanceof _definition.GraphQLInterfaceType) {
    return parentType.getFields()[name];
  }
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = suggestionList;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Given an invalid input string and a list of valid options, returns a filtered
 * list of valid options sorted based on their similarity with the input.
 */
function suggestionList(input, options) {
  var optionsByDistance = Object.create(null);
  var oLength = options.length;
  var inputThreshold = input.length / 2;
  for (var i = 0; i < oLength; i++) {
    var distance = lexicalDistance(input, options[i]);
    var threshold = Math.max(inputThreshold, options[i].length / 2, 1);
    if (distance <= threshold) {
      optionsByDistance[options[i]] = distance;
    }
  }
  return Object.keys(optionsByDistance).sort(function (a, b) {
    return optionsByDistance[a] - optionsByDistance[b];
  });
}

/**
 * Computes the lexical distance between strings A and B.
 *
 * The "distance" between two strings is given by counting the minimum number
 * of edits needed to transform string A into string B. An edit can be an
 * insertion, deletion, or substitution of a single character, or a swap of two
 * adjacent characters.
 *
 * This distance can be useful for detecting typos in input or sorting
 *
 * @param {string} a
 * @param {string} b
 * @return {int} distance in number of edits
 */
function lexicalDistance(a, b) {
  var i = void 0;
  var j = void 0;
  var d = [];
  var aLength = a.length;
  var bLength = b.length;

  for (i = 0; i <= aLength; i++) {
    d[i] = [i];
  }

  for (j = 1; j <= bLength; j++) {
    d[0][j] = j;
  }

  for (i = 1; i <= aLength; i++) {
    for (j = 1; j <= bLength; j++) {
      var cost = a[i - 1] === b[j - 1] ? 0 : 1;

      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }

  return d[aLength][bLength];
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quotedOrList;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var MAX_LENGTH = 5;

/**
 * Given [ A, B, C ] return '"A", "B", or "C"'.
 */
function quotedOrList(items) {
  var selected = items.slice(0, MAX_LENGTH);
  return selected.map(function (item) {
    return '"' + item + '"';
  }).reduce(function (list, quoted, index) {
    return list + (selected.length > 2 ? ', ' : ' ') + (index === selected.length - 1 ? 'or ' : '') + quoted;
  });
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultFieldResolver = undefined;
exports.execute = execute;
exports.responsePathAsArray = responsePathAsArray;
exports.addPath = addPath;
exports.assertValidExecutionArguments = assertValidExecutionArguments;
exports.buildExecutionContext = buildExecutionContext;
exports.getOperationRootType = getOperationRootType;
exports.collectFields = collectFields;
exports.buildResolveInfo = buildResolveInfo;
exports.resolveFieldValueOrError = resolveFieldValueOrError;
exports.getFieldDef = getFieldDef;

var _iterall = __webpack_require__(19);

var _error = __webpack_require__(0);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _isNullish = __webpack_require__(14);

var _isNullish2 = _interopRequireDefault(_isNullish);

var _typeFromAST = __webpack_require__(11);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _values = __webpack_require__(56);

var _definition = __webpack_require__(1);

var _schema = __webpack_require__(9);

var _introspection = __webpack_require__(15);

var _directives = __webpack_require__(10);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Terminology
 *
 * "Definitions" are the generic name for top-level statements in the document.
 * Examples of this include:
 * 1) Operations (such as a query)
 * 2) Fragments
 *
 * "Operations" are a generic name for requests in the document.
 * Examples of this include:
 * 1) query,
 * 2) mutation
 *
 * "Selections" are the definitions that can appear legally and at
 * single level of the query. These include:
 * 1) field references e.g "a"
 * 2) fragment "spreads" e.g. "...c"
 * 3) inline fragment "spreads" e.g. "...on Type { a }"
 */

/**
 * Data that must be available at all points during query execution.
 *
 * Namely, schema of the type system that is currently executing,
 * and the fragments defined in the query document
 */


/**
 * The result of GraphQL execution.
 *
 *   - `errors` is included when any errors occurred as a non-empty array.
 *   - `data` is the result of a successful execution of the query.
 */


/**
 * Implements the "Evaluating requests" section of the GraphQL specification.
 *
 * Returns a Promise that will eventually be resolved and never rejected.
 *
 * If the arguments to this function do not result in a legal execution context,
 * a GraphQLError will be thrown immediately explaining the invalid input.
 *
 * Accepts either an object with named arguments, or individual arguments.
 */

/* eslint-disable no-redeclare */
function execute(argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  // Extract arguments from object args if provided.
  var args = arguments.length === 1 ? argsOrSchema : undefined;
  var schema = args ? args.schema : argsOrSchema;
  return args ? executeImpl(schema, args.document, args.rootValue, args.contextValue, args.variableValues, args.operationName, args.fieldResolver) : executeImpl(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver);
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function executeImpl(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  // If arguments are missing or incorrect, throw an error.
  assertValidExecutionArguments(schema, document, variableValues);

  // If a valid context cannot be created due to incorrect arguments,
  // a "Response" with only errors is returned.
  var context = void 0;
  try {
    context = buildExecutionContext(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver);
  } catch (error) {
    return Promise.resolve({ errors: [error] });
  }

  // Return a Promise that will eventually resolve to the data described by
  // The "Response" section of the GraphQL specification.
  //
  // If errors are encountered while executing a GraphQL field, only that
  // field and its descendants will be omitted, and sibling fields will still
  // be executed. An execution which encounters errors will still result in a
  // resolved Promise.
  return Promise.resolve(executeOperation(context, context.operation, rootValue)).then(function (data) {
    return context.errors.length === 0 ? { data: data } : { errors: context.errors, data: data };
  });
}

/**
 * Given a ResponsePath (found in the `path` entry in the information provided
 * as the last argument to a field resolver), return an Array of the path keys.
 */
function responsePathAsArray(path) {
  var flattened = [];
  var curr = path;
  while (curr) {
    flattened.push(curr.key);
    curr = curr.prev;
  }
  return flattened.reverse();
}

/**
 * Given a ResponsePath and a key, return a new ResponsePath containing the
 * new key.
 */
function addPath(prev, key) {
  return { prev: prev, key: key };
}

/**
 * Essential assertions before executing to provide developer feedback for
 * improper use of the GraphQL library.
 */
function assertValidExecutionArguments(schema, document, rawVariableValues) {
  (0, _invariant2.default)(schema, 'Must provide schema');
  (0, _invariant2.default)(document, 'Must provide document');
  (0, _invariant2.default)(schema instanceof _schema.GraphQLSchema, 'Schema must be an instance of GraphQLSchema. Also ensure that there are ' + 'not multiple versions of GraphQL installed in your node_modules directory.');

  // Variables, if provided, must be an object.
  (0, _invariant2.default)(!rawVariableValues || typeof rawVariableValues === 'object', 'Variables must be provided as an Object where each property is a ' + 'variable value. Perhaps look to see if an unparsed JSON string ' + 'was provided.');
}

/**
 * Constructs a ExecutionContext object from the arguments passed to
 * execute, which we will pass throughout the other execution methods.
 *
 * Throws a GraphQLError if a valid execution context cannot be created.
 */
function buildExecutionContext(schema, document, rootValue, contextValue, rawVariableValues, operationName, fieldResolver) {
  var errors = [];
  var operation = void 0;
  var fragments = Object.create(null);
  document.definitions.forEach(function (definition) {
    switch (definition.kind) {
      case Kind.OPERATION_DEFINITION:
        if (!operationName && operation) {
          throw new _error.GraphQLError('Must provide operation name if query contains multiple operations.');
        }
        if (!operationName || definition.name && definition.name.value === operationName) {
          operation = definition;
        }
        break;
      case Kind.FRAGMENT_DEFINITION:
        fragments[definition.name.value] = definition;
        break;
      default:
        throw new _error.GraphQLError('GraphQL cannot execute a request containing a ' + definition.kind + '.', [definition]);
    }
  });
  if (!operation) {
    if (operationName) {
      throw new _error.GraphQLError('Unknown operation named "' + operationName + '".');
    } else {
      throw new _error.GraphQLError('Must provide an operation.');
    }
  }
  var variableValues = (0, _values.getVariableValues)(schema, operation.variableDefinitions || [], rawVariableValues || {});

  return {
    schema: schema,
    fragments: fragments,
    rootValue: rootValue,
    contextValue: contextValue,
    operation: operation,
    variableValues: variableValues,
    fieldResolver: fieldResolver || defaultFieldResolver,
    errors: errors
  };
}

/**
 * Implements the "Evaluating operations" section of the spec.
 */
function executeOperation(exeContext, operation, rootValue) {
  var type = getOperationRootType(exeContext.schema, operation);
  var fields = collectFields(exeContext, type, operation.selectionSet, Object.create(null), Object.create(null));

  var path = undefined;

  // Errors from sub-fields of a NonNull type may propagate to the top level,
  // at which point we still log the error and null the parent field, which
  // in this case is the entire response.
  //
  // Similar to completeValueCatchingError.
  try {
    var result = operation.operation === 'mutation' ? executeFieldsSerially(exeContext, type, rootValue, path, fields) : executeFields(exeContext, type, rootValue, path, fields);
    var promise = getPromise(result);
    if (promise) {
      return promise.then(undefined, function (error) {
        exeContext.errors.push(error);
        return Promise.resolve(null);
      });
    }
    return result;
  } catch (error) {
    exeContext.errors.push(error);
    return null;
  }
}

/**
 * Extracts the root type of the operation from the schema.
 */
function getOperationRootType(schema, operation) {
  switch (operation.operation) {
    case 'query':
      return schema.getQueryType();
    case 'mutation':
      var mutationType = schema.getMutationType();
      if (!mutationType) {
        throw new _error.GraphQLError('Schema is not configured for mutations', [operation]);
      }
      return mutationType;
    case 'subscription':
      var subscriptionType = schema.getSubscriptionType();
      if (!subscriptionType) {
        throw new _error.GraphQLError('Schema is not configured for subscriptions', [operation]);
      }
      return subscriptionType;
    default:
      throw new _error.GraphQLError('Can only execute queries, mutations and subscriptions', [operation]);
  }
}

/**
 * Implements the "Evaluating selection sets" section of the spec
 * for "write" mode.
 */
function executeFieldsSerially(exeContext, parentType, sourceValue, path, fields) {
  return Object.keys(fields).reduce(function (prevPromise, responseName) {
    return prevPromise.then(function (results) {
      var fieldNodes = fields[responseName];
      var fieldPath = addPath(path, responseName);
      var result = resolveField(exeContext, parentType, sourceValue, fieldNodes, fieldPath);
      if (result === undefined) {
        return results;
      }
      var promise = getPromise(result);
      if (promise) {
        return promise.then(function (resolvedResult) {
          results[responseName] = resolvedResult;
          return results;
        });
      }
      results[responseName] = result;
      return results;
    });
  }, Promise.resolve({}));
}

/**
 * Implements the "Evaluating selection sets" section of the spec
 * for "read" mode.
 */
function executeFields(exeContext, parentType, sourceValue, path, fields) {
  var containsPromise = false;

  var finalResults = Object.keys(fields).reduce(function (results, responseName) {
    var fieldNodes = fields[responseName];
    var fieldPath = addPath(path, responseName);
    var result = resolveField(exeContext, parentType, sourceValue, fieldNodes, fieldPath);
    if (result === undefined) {
      return results;
    }
    results[responseName] = result;
    if (getPromise(result)) {
      containsPromise = true;
    }
    return results;
  }, Object.create(null));

  // If there are no promises, we can just return the object
  if (!containsPromise) {
    return finalResults;
  }

  // Otherwise, results is a map from field name to the result
  // of resolving that field, which is possibly a promise. Return
  // a promise that will return this same map, but with any
  // promises replaced with the values they resolved to.
  return promiseForObject(finalResults);
}

/**
 * Given a selectionSet, adds all of the fields in that selection to
 * the passed in map of fields, and returns it at the end.
 *
 * CollectFields requires the "runtime type" of an object. For a field which
 * returns an Interface or Union type, the "runtime type" will be the actual
 * Object type returned by that field.
 */
function collectFields(exeContext, runtimeType, selectionSet, fields, visitedFragmentNames) {
  for (var i = 0; i < selectionSet.selections.length; i++) {
    var selection = selectionSet.selections[i];
    switch (selection.kind) {
      case Kind.FIELD:
        if (!shouldIncludeNode(exeContext, selection)) {
          continue;
        }
        var _name = getFieldEntryKey(selection);
        if (!fields[_name]) {
          fields[_name] = [];
        }
        fields[_name].push(selection);
        break;
      case Kind.INLINE_FRAGMENT:
        if (!shouldIncludeNode(exeContext, selection) || !doesFragmentConditionMatch(exeContext, selection, runtimeType)) {
          continue;
        }
        collectFields(exeContext, runtimeType, selection.selectionSet, fields, visitedFragmentNames);
        break;
      case Kind.FRAGMENT_SPREAD:
        var fragName = selection.name.value;
        if (visitedFragmentNames[fragName] || !shouldIncludeNode(exeContext, selection)) {
          continue;
        }
        visitedFragmentNames[fragName] = true;
        var fragment = exeContext.fragments[fragName];
        if (!fragment || !doesFragmentConditionMatch(exeContext, fragment, runtimeType)) {
          continue;
        }
        collectFields(exeContext, runtimeType, fragment.selectionSet, fields, visitedFragmentNames);
        break;
    }
  }
  return fields;
}

/**
 * Determines if a field should be included based on the @include and @skip
 * directives, where @skip has higher precidence than @include.
 */
function shouldIncludeNode(exeContext, node) {
  var skip = (0, _values.getDirectiveValues)(_directives.GraphQLSkipDirective, node, exeContext.variableValues);
  if (skip && skip.if === true) {
    return false;
  }

  var include = (0, _values.getDirectiveValues)(_directives.GraphQLIncludeDirective, node, exeContext.variableValues);
  if (include && include.if === false) {
    return false;
  }
  return true;
}

/**
 * Determines if a fragment is applicable to the given type.
 */
function doesFragmentConditionMatch(exeContext, fragment, type) {
  var typeConditionNode = fragment.typeCondition;
  if (!typeConditionNode) {
    return true;
  }
  var conditionalType = (0, _typeFromAST.typeFromAST)(exeContext.schema, typeConditionNode);
  if (conditionalType === type) {
    return true;
  }
  if ((0, _definition.isAbstractType)(conditionalType)) {
    return exeContext.schema.isPossibleType(conditionalType, type);
  }
  return false;
}

/**
 * This function transforms a JS object `{[key: string]: Promise<T>}` into
 * a `Promise<{[key: string]: T}>`
 *
 * This is akin to bluebird's `Promise.props`, but implemented only using
 * `Promise.all` so it will work with any implementation of ES6 promises.
 */
function promiseForObject(object) {
  var keys = Object.keys(object);
  var valuesAndPromises = keys.map(function (name) {
    return object[name];
  });
  return Promise.all(valuesAndPromises).then(function (values) {
    return values.reduce(function (resolvedObject, value, i) {
      resolvedObject[keys[i]] = value;
      return resolvedObject;
    }, Object.create(null));
  });
}

/**
 * Implements the logic to compute the key of a given field's entry
 */
function getFieldEntryKey(node) {
  return node.alias ? node.alias.value : node.name.value;
}

/**
 * Resolves the field on the given source object. In particular, this
 * figures out the value that the field returns by calling its resolve function,
 * then calls completeValue to complete promises, serialize scalars, or execute
 * the sub-selection-set for objects.
 */
function resolveField(exeContext, parentType, source, fieldNodes, path) {
  var fieldNode = fieldNodes[0];
  var fieldName = fieldNode.name.value;

  var fieldDef = getFieldDef(exeContext.schema, parentType, fieldName);
  if (!fieldDef) {
    return;
  }

  var resolveFn = fieldDef.resolve || exeContext.fieldResolver;

  var info = buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path);

  // Get the resolve function, regardless of if its result is normal
  // or abrupt (error).
  var result = resolveFieldValueOrError(exeContext, fieldDef, fieldNodes, resolveFn, source, info);

  return completeValueCatchingError(exeContext, fieldDef.type, fieldNodes, info, path, result);
}

function buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path) {
  // The resolve function's optional fourth argument is a collection of
  // information about the current execution state.
  return {
    fieldName: fieldNodes[0].name.value,
    fieldNodes: fieldNodes,
    returnType: fieldDef.type,
    parentType: parentType,
    path: path,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues
  };
}

// Isolates the "ReturnOrAbrupt" behavior to not de-opt the `resolveField`
// function. Returns the result of resolveFn or the abrupt-return Error object.
function resolveFieldValueOrError(exeContext, fieldDef, fieldNodes, resolveFn, source, info) {
  try {
    // Build a JS object of arguments from the field.arguments AST, using the
    // variables scope to fulfill any variable references.
    // TODO: find a way to memoize, in case this field is within a List type.
    var args = (0, _values.getArgumentValues)(fieldDef, fieldNodes[0], exeContext.variableValues);

    // The resolve function's optional third argument is a context value that
    // is provided to every resolve function within an execution. It is commonly
    // used to represent an authenticated user, or request-specific caches.
    var context = exeContext.contextValue;

    return resolveFn(source, args, context, info);
  } catch (error) {
    // Sometimes a non-error is thrown, wrap it as an Error for a
    // consistent interface.
    return error instanceof Error ? error : new Error(error);
  }
}

// This is a small wrapper around completeValue which detects and logs errors
// in the execution context.
function completeValueCatchingError(exeContext, returnType, fieldNodes, info, path, result) {
  // If the field type is non-nullable, then it is resolved without any
  // protection from errors, however it still properly locates the error.
  if (returnType instanceof _definition.GraphQLNonNull) {
    return completeValueWithLocatedError(exeContext, returnType, fieldNodes, info, path, result);
  }

  // Otherwise, error protection is applied, logging the error and resolving
  // a null value for this field if one is encountered.
  try {
    var completed = completeValueWithLocatedError(exeContext, returnType, fieldNodes, info, path, result);
    var promise = getPromise(completed);
    if (promise) {
      // If `completeValueWithLocatedError` returned a rejected promise, log
      // the rejection error and resolve to null.
      // Note: we don't rely on a `catch` method, but we do expect "thenable"
      // to take a second callback for the error case.
      return promise.then(undefined, function (error) {
        exeContext.errors.push(error);
        return Promise.resolve(null);
      });
    }
    return completed;
  } catch (error) {
    // If `completeValueWithLocatedError` returned abruptly (threw an error),
    // log the error and return null.
    exeContext.errors.push(error);
    return null;
  }
}

// This is a small wrapper around completeValue which annotates errors with
// location information.
function completeValueWithLocatedError(exeContext, returnType, fieldNodes, info, path, result) {
  try {
    var completed = completeValue(exeContext, returnType, fieldNodes, info, path, result);
    var promise = getPromise(completed);
    if (promise) {
      return promise.then(undefined, function (error) {
        return Promise.reject((0, _error.locatedError)(error, fieldNodes, responsePathAsArray(path)));
      });
    }
    return completed;
  } catch (error) {
    throw (0, _error.locatedError)(error, fieldNodes, responsePathAsArray(path));
  }
}

/**
 * Implements the instructions for completeValue as defined in the
 * "Field entries" section of the spec.
 *
 * If the field type is Non-Null, then this recursively completes the value
 * for the inner type. It throws a field error if that completion returns null,
 * as per the "Nullability" section of the spec.
 *
 * If the field type is a List, then this recursively completes the value
 * for the inner type on each item in the list.
 *
 * If the field type is a Scalar or Enum, ensures the completed value is a legal
 * value of the type by calling the `serialize` method of GraphQL type
 * definition.
 *
 * If the field is an abstract type, determine the runtime type of the value
 * and then complete based on that type
 *
 * Otherwise, the field type expects a sub-selection set, and will complete the
 * value by evaluating all sub-selections.
 */
function completeValue(exeContext, returnType, fieldNodes, info, path, result) {
  // If result is a Promise, apply-lift over completeValue.
  var promise = getPromise(result);
  if (promise) {
    return promise.then(function (resolved) {
      return completeValue(exeContext, returnType, fieldNodes, info, path, resolved);
    });
  }

  // If result is an Error, throw a located error.
  if (result instanceof Error) {
    throw result;
  }

  // If field type is NonNull, complete for inner type, and throw field error
  // if result is null.
  if (returnType instanceof _definition.GraphQLNonNull) {
    var completed = completeValue(exeContext, returnType.ofType, fieldNodes, info, path, result);
    if (completed === null) {
      throw new Error('Cannot return null for non-nullable field ' + info.parentType.name + '.' + info.fieldName + '.');
    }
    return completed;
  }

  // If result value is null-ish (null, undefined, or NaN) then return null.
  if ((0, _isNullish2.default)(result)) {
    return null;
  }

  // If field type is List, complete each item in the list with the inner type
  if (returnType instanceof _definition.GraphQLList) {
    return completeListValue(exeContext, returnType, fieldNodes, info, path, result);
  }

  // If field type is a leaf type, Scalar or Enum, serialize to a valid value,
  // returning null if serialization is not possible.
  if ((0, _definition.isLeafType)(returnType)) {
    return completeLeafValue(returnType, result);
  }

  // If field type is an abstract type, Interface or Union, determine the
  // runtime Object type and complete for that type.
  if ((0, _definition.isAbstractType)(returnType)) {
    return completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result);
  }

  // If field type is Object, execute and complete all sub-selections.
  if (returnType instanceof _definition.GraphQLObjectType) {
    return completeObjectValue(exeContext, returnType, fieldNodes, info, path, result);
  }

  // Not reachable. All possible output types have been considered.
  throw new Error('Cannot complete value of unexpected type "' + String(returnType) + '".');
}

/**
 * Complete a list value by completing each item in the list with the
 * inner type
 */
function completeListValue(exeContext, returnType, fieldNodes, info, path, result) {
  (0, _invariant2.default)((0, _iterall.isCollection)(result), 'Expected Iterable, but did not find one for field ' + info.parentType.name + '.' + info.fieldName + '.');

  // This is specified as a simple map, however we're optimizing the path
  // where the list contains no Promises by avoiding creating another Promise.
  var itemType = returnType.ofType;
  var containsPromise = false;
  var completedResults = [];
  (0, _iterall.forEach)(result, function (item, index) {
    // No need to modify the info object containing the path,
    // since from here on it is not ever accessed by resolver functions.
    var fieldPath = addPath(path, index);
    var completedItem = completeValueCatchingError(exeContext, itemType, fieldNodes, info, fieldPath, item);

    if (!containsPromise && getPromise(completedItem)) {
      containsPromise = true;
    }
    completedResults.push(completedItem);
  });

  return containsPromise ? Promise.all(completedResults) : completedResults;
}

/**
 * Complete a Scalar or Enum by serializing to a valid value, returning
 * null if serialization is not possible.
 */
function completeLeafValue(returnType, result) {
  (0, _invariant2.default)(returnType.serialize, 'Missing serialize method on type');
  var serializedResult = returnType.serialize(result);
  if ((0, _isNullish2.default)(serializedResult)) {
    throw new Error('Expected a value of type "' + String(returnType) + '" but ' + ('received: ' + String(result)));
  }
  return serializedResult;
}

/**
 * Complete a value of an abstract type by determining the runtime object type
 * of that value, then complete the value for that type.
 */
function completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result) {
  var runtimeType = returnType.resolveType ? returnType.resolveType(result, exeContext.contextValue, info) : defaultResolveTypeFn(result, exeContext.contextValue, info, returnType);

  var promise = getPromise(runtimeType);
  if (promise) {
    return promise.then(function (resolvedRuntimeType) {
      return completeObjectValue(exeContext, ensureValidRuntimeType(resolvedRuntimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result);
    });
  }

  return completeObjectValue(exeContext, ensureValidRuntimeType(runtimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result);
}

function ensureValidRuntimeType(runtimeTypeOrName, exeContext, returnType, fieldNodes, info, result) {
  var runtimeType = typeof runtimeTypeOrName === 'string' ? exeContext.schema.getType(runtimeTypeOrName) : runtimeTypeOrName;

  if (!(runtimeType instanceof _definition.GraphQLObjectType)) {
    throw new _error.GraphQLError('Abstract type ' + returnType.name + ' must resolve to an Object type at ' + ('runtime for field ' + info.parentType.name + '.' + info.fieldName + ' with ') + ('value "' + String(result) + '", received "' + String(runtimeType) + '".'), fieldNodes);
  }

  if (!exeContext.schema.isPossibleType(returnType, runtimeType)) {
    throw new _error.GraphQLError('Runtime Object type "' + runtimeType.name + '" is not a possible type ' + ('for "' + returnType.name + '".'), fieldNodes);
  }

  return runtimeType;
}

/**
 * Complete an Object value by executing all sub-selections.
 */
function completeObjectValue(exeContext, returnType, fieldNodes, info, path, result) {
  // If there is an isTypeOf predicate function, call it with the
  // current result. If isTypeOf returns false, then raise an error rather
  // than continuing execution.
  if (returnType.isTypeOf) {
    var isTypeOf = returnType.isTypeOf(result, exeContext.contextValue, info);

    var promise = getPromise(isTypeOf);
    if (promise) {
      return promise.then(function (isTypeOfResult) {
        if (!isTypeOfResult) {
          throw invalidReturnTypeError(returnType, result, fieldNodes);
        }
        return collectAndExecuteSubfields(exeContext, returnType, fieldNodes, info, path, result);
      });
    }

    if (!isTypeOf) {
      throw invalidReturnTypeError(returnType, result, fieldNodes);
    }
  }

  return collectAndExecuteSubfields(exeContext, returnType, fieldNodes, info, path, result);
}

function invalidReturnTypeError(returnType, result, fieldNodes) {
  return new _error.GraphQLError('Expected value of type "' + returnType.name + '" but got: ' + String(result) + '.', fieldNodes);
}

function collectAndExecuteSubfields(exeContext, returnType, fieldNodes, info, path, result) {
  // Collect sub-fields to execute to complete this value.
  var subFieldNodes = Object.create(null);
  var visitedFragmentNames = Object.create(null);
  for (var i = 0; i < fieldNodes.length; i++) {
    var selectionSet = fieldNodes[i].selectionSet;
    if (selectionSet) {
      subFieldNodes = collectFields(exeContext, returnType, selectionSet, subFieldNodes, visitedFragmentNames);
    }
  }

  return executeFields(exeContext, returnType, result, path, subFieldNodes);
}

/**
 * If a resolveType function is not given, then a default resolve behavior is
 * used which tests each possible type for the abstract type by calling
 * isTypeOf for the object being coerced, returning the first type that matches.
 */
function defaultResolveTypeFn(value, context, info, abstractType) {
  var possibleTypes = info.schema.getPossibleTypes(abstractType);
  var promisedIsTypeOfResults = [];

  for (var i = 0; i < possibleTypes.length; i++) {
    var type = possibleTypes[i];

    if (type.isTypeOf) {
      var isTypeOfResult = type.isTypeOf(value, context, info);

      var promise = getPromise(isTypeOfResult);
      if (promise) {
        promisedIsTypeOfResults[i] = promise;
      } else if (isTypeOfResult) {
        return type;
      }
    }
  }

  if (promisedIsTypeOfResults.length) {
    return Promise.all(promisedIsTypeOfResults).then(function (isTypeOfResults) {
      for (var _i = 0; _i < isTypeOfResults.length; _i++) {
        if (isTypeOfResults[_i]) {
          return possibleTypes[_i];
        }
      }
    });
  }
}

/**
 * If a resolve function is not given, then a default resolve behavior is used
 * which takes the property of the source object of the same name as the field
 * and returns it as the result, or if it's a function, returns the result
 * of calling that function while passing along args and context.
 */
var defaultFieldResolver = exports.defaultFieldResolver = function defaultFieldResolver(source, args, context, info) {
  // ensure source is a value for which property access is acceptable.
  if (typeof source === 'object' || typeof source === 'function') {
    var property = source[info.fieldName];
    if (typeof property === 'function') {
      return source[info.fieldName](args, context, info);
    }
    return property;
  }
};

/**
 * Only returns the value if it acts like a Promise, i.e. has a "then" function,
 * otherwise returns void.
 */
function getPromise(value) {
  if (typeof value === 'object' && value !== null && typeof value.then === 'function') {
    return value;
  }
}

/**
 * This method looks up the field on the given type defintion.
 * It has special casing for the two introspection fields, __schema
 * and __typename. __typename is special because it can always be
 * queried as a field, even in situations where no other fields
 * are allowed, like on a Union. __schema could get automatically
 * added to the query type, but that would require mutating type
 * definitions, which would cause issues.
 */
function getFieldDef(schema, parentType, fieldName) {
  if (fieldName === _introspection.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _introspection.SchemaMetaFieldDef;
  } else if (fieldName === _introspection.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _introspection.TypeMetaFieldDef;
  } else if (fieldName === _introspection.TypeNameMetaFieldDef.name) {
    return _introspection.TypeNameMetaFieldDef;
  }
  return parentType.getFields()[fieldName];
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVariableValues = getVariableValues;
exports.getArgumentValues = getArgumentValues;
exports.getDirectiveValues = getDirectiveValues;

var _iterall = __webpack_require__(19);

var _error = __webpack_require__(0);

var _find = __webpack_require__(20);

var _find2 = _interopRequireDefault(_find);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _isNullish = __webpack_require__(14);

var _isNullish2 = _interopRequireDefault(_isNullish);

var _isInvalid = __webpack_require__(27);

var _isInvalid2 = _interopRequireDefault(_isInvalid);

var _keyMap = __webpack_require__(21);

var _keyMap2 = _interopRequireDefault(_keyMap);

var _typeFromAST = __webpack_require__(11);

var _valueFromAST = __webpack_require__(28);

var _isValidJSValue = __webpack_require__(107);

var _isValidLiteralValue = __webpack_require__(36);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _printer = __webpack_require__(7);

var _definition = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Prepares an object map of variableValues of the correct type based on the
 * provided variable definitions and arbitrary input. If the input cannot be
 * parsed to match the variable definitions, a GraphQLError will be thrown.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function getVariableValues(schema, varDefNodes, inputs) {
  var coercedValues = Object.create(null);
  for (var i = 0; i < varDefNodes.length; i++) {
    var varDefNode = varDefNodes[i];
    var varName = varDefNode.variable.name.value;
    var varType = (0, _typeFromAST.typeFromAST)(schema, varDefNode.type);
    if (!(0, _definition.isInputType)(varType)) {
      throw new _error.GraphQLError('Variable "$' + varName + '" expected value of type ' + ('"' + (0, _printer.print)(varDefNode.type) + '" which cannot be used as an input type.'), [varDefNode.type]);
    }

    var value = inputs[varName];
    if ((0, _isInvalid2.default)(value)) {
      var defaultValue = varDefNode.defaultValue;
      if (defaultValue) {
        coercedValues[varName] = (0, _valueFromAST.valueFromAST)(defaultValue, varType);
      }
      if (varType instanceof _definition.GraphQLNonNull) {
        throw new _error.GraphQLError('Variable "$' + varName + '" of required type ' + ('"' + String(varType) + '" was not provided.'), [varDefNode]);
      }
    } else {
      var errors = (0, _isValidJSValue.isValidJSValue)(value, varType);
      if (errors.length) {
        var message = errors ? '\n' + errors.join('\n') : '';
        throw new _error.GraphQLError('Variable "$' + varName + '" got invalid value ' + (JSON.stringify(value) + '.' + message), [varDefNode]);
      }

      var coercedValue = coerceValue(varType, value);
      (0, _invariant2.default)(!(0, _isInvalid2.default)(coercedValue), 'Should have reported error.');
      coercedValues[varName] = coercedValue;
    }
  }
  return coercedValues;
}

/**
 * Prepares an object map of argument values given a list of argument
 * definitions and list of argument AST nodes.
 */
function getArgumentValues(def, node, variableValues) {
  var argDefs = def.args;
  var argNodes = node.arguments;
  if (!argDefs || !argNodes) {
    return {};
  }
  var coercedValues = Object.create(null);
  var argNodeMap = (0, _keyMap2.default)(argNodes, function (arg) {
    return arg.name.value;
  });
  for (var i = 0; i < argDefs.length; i++) {
    var argDef = argDefs[i];
    var name = argDef.name;
    var argType = argDef.type;
    var argumentNode = argNodeMap[name];
    var defaultValue = argDef.defaultValue;
    if (!argumentNode) {
      if (!(0, _isInvalid2.default)(defaultValue)) {
        coercedValues[name] = defaultValue;
      } else if (argType instanceof _definition.GraphQLNonNull) {
        throw new _error.GraphQLError('Argument "' + name + '" of required type ' + ('"' + String(argType) + '" was not provided.'), [node]);
      }
    } else if (argumentNode.value.kind === Kind.VARIABLE) {
      var variableName = argumentNode.value.name.value;
      if (variableValues && !(0, _isInvalid2.default)(variableValues[variableName])) {
        // Note: this does not check that this variable value is correct.
        // This assumes that this query has been validated and the variable
        // usage here is of the correct type.
        coercedValues[name] = variableValues[variableName];
      } else if (!(0, _isInvalid2.default)(defaultValue)) {
        coercedValues[name] = defaultValue;
      } else if (argType instanceof _definition.GraphQLNonNull) {
        throw new _error.GraphQLError('Argument "' + name + '" of required type "' + String(argType) + '" was ' + ('provided the variable "$' + variableName + '" which was not provided ') + 'a runtime value.', [argumentNode.value]);
      }
    } else {
      var valueNode = argumentNode.value;
      var coercedValue = (0, _valueFromAST.valueFromAST)(valueNode, argType, variableValues);
      if ((0, _isInvalid2.default)(coercedValue)) {
        var errors = (0, _isValidLiteralValue.isValidLiteralValue)(argType, valueNode);
        var message = errors ? '\n' + errors.join('\n') : '';
        throw new _error.GraphQLError('Argument "' + name + '" got invalid value ' + (0, _printer.print)(valueNode) + '.' + message, [argumentNode.value]);
      }
      coercedValues[name] = coercedValue;
    }
  }
  return coercedValues;
}

/**
 * Prepares an object map of argument values given a directive definition
 * and a AST node which may contain directives. Optionally also accepts a map
 * of variable values.
 *
 * If the directive does not exist on the node, returns undefined.
 */
function getDirectiveValues(directiveDef, node, variableValues) {
  var directiveNode = node.directives && (0, _find2.default)(node.directives, function (directive) {
    return directive.name.value === directiveDef.name;
  });

  if (directiveNode) {
    return getArgumentValues(directiveDef, directiveNode, variableValues);
  }
}

/**
 * Given a type and any value, return a runtime value coerced to match the type.
 */
function coerceValue(type, value) {
  // Ensure flow knows that we treat function params as const.
  var _value = value;

  if ((0, _isInvalid2.default)(_value)) {
    return; // Intentionally return no value.
  }

  if (type instanceof _definition.GraphQLNonNull) {
    if (_value === null) {
      return; // Intentionally return no value.
    }
    return coerceValue(type.ofType, _value);
  }

  if (_value === null) {
    // Intentionally return the value null.
    return null;
  }

  if (type instanceof _definition.GraphQLList) {
    var itemType = type.ofType;
    if ((0, _iterall.isCollection)(_value)) {
      var coercedValues = [];
      var valueIter = (0, _iterall.createIterator)(_value);
      if (!valueIter) {
        return; // Intentionally return no value.
      }
      var step = void 0;
      while (!(step = valueIter.next()).done) {
        var itemValue = coerceValue(itemType, step.value);
        if ((0, _isInvalid2.default)(itemValue)) {
          return; // Intentionally return no value.
        }
        coercedValues.push(itemValue);
      }
      return coercedValues;
    }
    var coercedValue = coerceValue(itemType, _value);
    if ((0, _isInvalid2.default)(coercedValue)) {
      return; // Intentionally return no value.
    }
    return [coerceValue(itemType, _value)];
  }

  if (type instanceof _definition.GraphQLInputObjectType) {
    if (typeof _value !== 'object') {
      return; // Intentionally return no value.
    }
    var coercedObj = Object.create(null);
    var fields = type.getFields();
    var fieldNames = Object.keys(fields);
    for (var i = 0; i < fieldNames.length; i++) {
      var fieldName = fieldNames[i];
      var field = fields[fieldName];
      if ((0, _isInvalid2.default)(_value[fieldName])) {
        if (!(0, _isInvalid2.default)(field.defaultValue)) {
          coercedObj[fieldName] = field.defaultValue;
        } else if (field.type instanceof _definition.GraphQLNonNull) {
          return; // Intentionally return no value.
        }
        continue;
      }
      var fieldValue = coerceValue(field.type, _value[fieldName]);
      if ((0, _isInvalid2.default)(fieldValue)) {
        return; // Intentionally return no value.
      }
      coercedObj[fieldName] = fieldValue;
    }
    return coercedObj;
  }

  (0, _invariant2.default)(type instanceof _definition.GraphQLScalarType || type instanceof _definition.GraphQLEnumType, 'Must be input type');

  var parsed = type.parseValue(_value);
  if ((0, _isNullish2.default)(parsed)) {
    // null or invalid values represent a failure to parse correctly,
    // in which case no value is returned.
    return;
  }

  return parsed;
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyValMap;

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * and a function to produce the values from each item in the array.
 *
 *     const phoneBook = [
 *       { name: 'Jon', num: '555-1234' },
 *       { name: 'Jenny', num: '867-5309' }
 *     ]
 *
 *     // { Jon: '555-1234', Jenny: '867-5309' }
 *     const phonesByName = keyValMap(
 *       phoneBook,
 *       entry => entry.name,
 *       entry => entry.num
 *     )
 *
 */
function keyValMap(list, keyFn, valFn) {
  return list.reduce(function (map, item) {
    return map[keyFn(item)] = valFn(item), map;
  }, Object.create(null));
}

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(121)
  , enumBugKeys = __webpack_require__(64);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(33);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(43)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(6)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 64 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(42);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(67)
  , $export        = __webpack_require__(29)
  , redefine       = __webpack_require__(132)
  , hide           = __webpack_require__(16)
  , has            = __webpack_require__(32)
  , Iterators      = __webpack_require__(23)
  , $iterCreate    = __webpack_require__(133)
  , setToStringTag = __webpack_require__(45)
  , getPrototypeOf = __webpack_require__(136)
  , ITERATOR       = __webpack_require__(5)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6).document && document.documentElement;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(33)
  , TAG = __webpack_require__(5)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(30)
  , invoke             = __webpack_require__(148)
  , html               = __webpack_require__(68)
  , cel                = __webpack_require__(40)
  , global             = __webpack_require__(6)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(33)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = __webpack_require__(8);

var _exception = __webpack_require__(24);

var _exception2 = _interopRequireDefault(_exception);

var _helpers = __webpack_require__(165);

var _decorators = __webpack_require__(173);

var _logger = __webpack_require__(175);

var _logger2 = _interopRequireDefault(_logger);

var VERSION = '4.0.10';
exports.VERSION = VERSION;
var COMPILER_REVISION = 7;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2Jhc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBQTRDLFNBQVM7O3lCQUMvQixhQUFhOzs7O3VCQUNFLFdBQVc7OzBCQUNSLGNBQWM7O3NCQUNuQyxVQUFVOzs7O0FBRXRCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQzs7QUFDekIsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7OztBQUU1QixJQUFNLGdCQUFnQixHQUFHO0FBQzlCLEdBQUMsRUFBRSxhQUFhO0FBQ2hCLEdBQUMsRUFBRSxlQUFlO0FBQ2xCLEdBQUMsRUFBRSxlQUFlO0FBQ2xCLEdBQUMsRUFBRSxVQUFVO0FBQ2IsR0FBQyxFQUFFLGtCQUFrQjtBQUNyQixHQUFDLEVBQUUsaUJBQWlCO0FBQ3BCLEdBQUMsRUFBRSxVQUFVO0NBQ2QsQ0FBQzs7O0FBRUYsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7O0FBRTlCLFNBQVMscUJBQXFCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7QUFDbkUsTUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUMvQixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7O0FBRW5DLGtDQUF1QixJQUFJLENBQUMsQ0FBQztBQUM3Qix3Q0FBMEIsSUFBSSxDQUFDLENBQUM7Q0FDakM7O0FBRUQscUJBQXFCLENBQUMsU0FBUyxHQUFHO0FBQ2hDLGFBQVcsRUFBRSxxQkFBcUI7O0FBRWxDLFFBQU0scUJBQVE7QUFDZCxLQUFHLEVBQUUsb0JBQU8sR0FBRzs7QUFFZixnQkFBYyxFQUFFLHdCQUFTLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDakMsUUFBSSxnQkFBUyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO0FBQ3RDLFVBQUksRUFBRSxFQUFFO0FBQUUsY0FBTSwyQkFBYyx5Q0FBeUMsQ0FBQyxDQUFDO09BQUU7QUFDM0Usb0JBQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1QixNQUFNO0FBQ0wsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDekI7R0FDRjtBQUNELGtCQUFnQixFQUFFLDBCQUFTLElBQUksRUFBRTtBQUMvQixXQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDM0I7O0FBRUQsaUJBQWUsRUFBRSx5QkFBUyxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQ3ZDLFFBQUksZ0JBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLFVBQVUsRUFBRTtBQUN0QyxvQkFBTyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzdCLE1BQU07QUFDTCxVQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTtBQUNsQyxjQUFNLHlFQUEwRCxJQUFJLG9CQUFpQixDQUFDO09BQ3ZGO0FBQ0QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7S0FDL0I7R0FDRjtBQUNELG1CQUFpQixFQUFFLDJCQUFTLElBQUksRUFBRTtBQUNoQyxXQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUI7O0FBRUQsbUJBQWlCLEVBQUUsMkJBQVMsSUFBSSxFQUFFLEVBQUUsRUFBRTtBQUNwQyxRQUFJLGdCQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLEVBQUU7QUFDdEMsVUFBSSxFQUFFLEVBQUU7QUFBRSxjQUFNLDJCQUFjLDRDQUE0QyxDQUFDLENBQUM7T0FBRTtBQUM5RSxvQkFBTyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQy9CLE1BQU07QUFDTCxVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM1QjtHQUNGO0FBQ0QscUJBQW1CLEVBQUUsNkJBQVMsSUFBSSxFQUFFO0FBQ2xDLFdBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5QjtDQUNGLENBQUM7O0FBRUssSUFBSSxHQUFHLEdBQUcsb0JBQU8sR0FBRyxDQUFDOzs7UUFFcEIsV0FBVztRQUFFLE1BQU0iLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlRnJhbWUsIGV4dGVuZCwgdG9TdHJpbmd9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2V4Y2VwdGlvbic7XG5pbXBvcnQge3JlZ2lzdGVyRGVmYXVsdEhlbHBlcnN9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQge3JlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnN9IGZyb20gJy4vZGVjb3JhdG9ycyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcblxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnNC4wLjEwJztcbmV4cG9ydCBjb25zdCBDT01QSUxFUl9SRVZJU0lPTiA9IDc7XG5cbmV4cG9ydCBjb25zdCBSRVZJU0lPTl9DSEFOR0VTID0ge1xuICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuICAyOiAnPT0gMS4wLjAtcmMuMycsXG4gIDM6ICc9PSAxLjAuMC1yYy40JyxcbiAgNDogJz09IDEueC54JyxcbiAgNTogJz09IDIuMC4wLWFscGhhLngnLFxuICA2OiAnPj0gMi4wLjAtYmV0YS4xJyxcbiAgNzogJz49IDQuMC4wJ1xufTtcblxuY29uc3Qgb2JqZWN0VHlwZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG5leHBvcnQgZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzLCBkZWNvcmF0b3JzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcbiAgdGhpcy5kZWNvcmF0b3JzID0gZGVjb3JhdG9ycyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xuICByZWdpc3RlckRlZmF1bHREZWNvcmF0b3JzKHRoaXMpO1xufVxuXG5IYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZ2dlci5sb2csXG5cbiAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChmbikgeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTsgfVxuICAgICAgZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLmhlbHBlcnNbbmFtZV07XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBwYXJ0aWFsKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGV4dGVuZCh0aGlzLnBhcnRpYWxzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBwYXJ0aWFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKGBBdHRlbXB0aW5nIHRvIHJlZ2lzdGVyIGEgcGFydGlhbCBjYWxsZWQgXCIke25hbWV9XCIgYXMgdW5kZWZpbmVkYCk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gcGFydGlhbDtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMucGFydGlhbHNbbmFtZV07XG4gIH0sXG5cbiAgcmVnaXN0ZXJEZWNvcmF0b3I6IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChmbikgeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGRlY29yYXRvcnMnKTsgfVxuICAgICAgZXh0ZW5kKHRoaXMuZGVjb3JhdG9ycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVjb3JhdG9yc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRvcnNbbmFtZV07XG4gIH1cbn07XG5cbmV4cG9ydCBsZXQgbG9nID0gbG9nZ2VyLmxvZztcblxuZXhwb3J0IHtjcmVhdGVGcmFtZSwgbG9nZ2VyfTtcbiJdfQ==


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 73 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var settle = __webpack_require__(185);
var buildURL = __webpack_require__(187);
var parseHeaders = __webpack_require__(188);
var isURLSameOrigin = __webpack_require__(189);
var createError = __webpack_require__(75);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(190);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("production " !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(191);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(186);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * A representation of source input to GraphQL. The name is optional,
 * but is mostly useful for clients who store GraphQL documents in
 * source files; for example, if the GraphQL input is in a file Foo.graphql,
 * it might be useful for name to be "Foo.graphql".
 */
var Source = exports.Source = function Source(body, name) {
  _classCallCheck(this, Source);

  this.body = body;
  this.name = name || 'GraphQL request';
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationContext = undefined;
exports.validate = validate;

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _error = __webpack_require__(0);

var _visitor = __webpack_require__(26);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _schema = __webpack_require__(9);

var _TypeInfo = __webpack_require__(52);

var _specifiedRules = __webpack_require__(80);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Implements the "Validation" section of the spec.
 *
 * Validation runs synchronously, returning an array of encountered errors, or
 * an empty array if no errors were encountered and the document is valid.
 *
 * A list of specific validation rules may be provided. If not provided, the
 * default list of rules defined by the GraphQL specification will be used.
 *
 * Each validation rules is a function which returns a visitor
 * (see the language/visitor API). Visitor methods are expected to return
 * GraphQLErrors, or Arrays of GraphQLErrors when invalid.
 *
 * Optionally a custom TypeInfo instance may be provided. If not provided, one
 * will be created from the provided schema.
 */
function validate(schema, ast, rules, typeInfo) {
  (0, _invariant2.default)(schema, 'Must provide schema');
  (0, _invariant2.default)(ast, 'Must provide document');
  (0, _invariant2.default)(schema instanceof _schema.GraphQLSchema, 'Schema must be an instance of GraphQLSchema. Also ensure that there are ' + 'not multiple versions of GraphQL installed in your node_modules directory.');
  return visitUsingRules(schema, typeInfo || new _TypeInfo.TypeInfo(schema), ast, rules || _specifiedRules.specifiedRules);
}

/**
 * This uses a specialized visitor which runs multiple visitors in parallel,
 * while maintaining the visitor skip and break API.
 *
 * @internal
 */
function visitUsingRules(schema, typeInfo, documentAST, rules) {
  var context = new ValidationContext(schema, documentAST, typeInfo);
  var visitors = rules.map(function (rule) {
    return rule(context);
  });
  // Visit the whole document with each instance of all provided rules.
  (0, _visitor.visit)(documentAST, (0, _visitor.visitWithTypeInfo)(typeInfo, (0, _visitor.visitInParallel)(visitors)));
  return context.getErrors();
}

/**
 * An instance of this class is passed as the "this" context to all validators,
 * allowing access to commonly useful contextual information from within a
 * validation rule.
 */
var ValidationContext = exports.ValidationContext = function () {
  function ValidationContext(schema, ast, typeInfo) {
    _classCallCheck(this, ValidationContext);

    this._schema = schema;
    this._ast = ast;
    this._typeInfo = typeInfo;
    this._errors = [];
    this._fragmentSpreads = new Map();
    this._recursivelyReferencedFragments = new Map();
    this._variableUsages = new Map();
    this._recursiveVariableUsages = new Map();
  }

  ValidationContext.prototype.reportError = function reportError(error) {
    this._errors.push(error);
  };

  ValidationContext.prototype.getErrors = function getErrors() {
    return this._errors;
  };

  ValidationContext.prototype.getSchema = function getSchema() {
    return this._schema;
  };

  ValidationContext.prototype.getDocument = function getDocument() {
    return this._ast;
  };

  ValidationContext.prototype.getFragment = function getFragment(name) {
    var fragments = this._fragments;
    if (!fragments) {
      this._fragments = fragments = this.getDocument().definitions.reduce(function (frags, statement) {
        if (statement.kind === Kind.FRAGMENT_DEFINITION) {
          frags[statement.name.value] = statement;
        }
        return frags;
      }, Object.create(null));
    }
    return fragments[name];
  };

  ValidationContext.prototype.getFragmentSpreads = function getFragmentSpreads(node) {
    var spreads = this._fragmentSpreads.get(node);
    if (!spreads) {
      spreads = [];
      var setsToVisit = [node];
      while (setsToVisit.length !== 0) {
        var set = setsToVisit.pop();
        for (var i = 0; i < set.selections.length; i++) {
          var selection = set.selections[i];
          if (selection.kind === Kind.FRAGMENT_SPREAD) {
            spreads.push(selection);
          } else if (selection.selectionSet) {
            setsToVisit.push(selection.selectionSet);
          }
        }
      }
      this._fragmentSpreads.set(node, spreads);
    }
    return spreads;
  };

  ValidationContext.prototype.getRecursivelyReferencedFragments = function getRecursivelyReferencedFragments(operation) {
    var fragments = this._recursivelyReferencedFragments.get(operation);
    if (!fragments) {
      fragments = [];
      var collectedNames = Object.create(null);
      var nodesToVisit = [operation.selectionSet];
      while (nodesToVisit.length !== 0) {
        var _node = nodesToVisit.pop();
        var spreads = this.getFragmentSpreads(_node);
        for (var i = 0; i < spreads.length; i++) {
          var fragName = spreads[i].name.value;
          if (collectedNames[fragName] !== true) {
            collectedNames[fragName] = true;
            var fragment = this.getFragment(fragName);
            if (fragment) {
              fragments.push(fragment);
              nodesToVisit.push(fragment.selectionSet);
            }
          }
        }
      }
      this._recursivelyReferencedFragments.set(operation, fragments);
    }
    return fragments;
  };

  ValidationContext.prototype.getVariableUsages = function getVariableUsages(node) {
    var usages = this._variableUsages.get(node);
    if (!usages) {
      var newUsages = [];
      var typeInfo = new _TypeInfo.TypeInfo(this._schema);
      (0, _visitor.visit)(node, (0, _visitor.visitWithTypeInfo)(typeInfo, {
        VariableDefinition: function VariableDefinition() {
          return false;
        },
        Variable: function Variable(variable) {
          newUsages.push({ node: variable, type: typeInfo.getInputType() });
        }
      }));
      usages = newUsages;
      this._variableUsages.set(node, usages);
    }
    return usages;
  };

  ValidationContext.prototype.getRecursiveVariableUsages = function getRecursiveVariableUsages(operation) {
    var usages = this._recursiveVariableUsages.get(operation);
    if (!usages) {
      usages = this.getVariableUsages(operation);
      var fragments = this.getRecursivelyReferencedFragments(operation);
      for (var i = 0; i < fragments.length; i++) {
        Array.prototype.push.apply(usages, this.getVariableUsages(fragments[i]));
      }
      this._recursiveVariableUsages.set(operation, usages);
    }
    return usages;
  };

  ValidationContext.prototype.getType = function getType() {
    return this._typeInfo.getType();
  };

  ValidationContext.prototype.getParentType = function getParentType() {
    return this._typeInfo.getParentType();
  };

  ValidationContext.prototype.getInputType = function getInputType() {
    return this._typeInfo.getInputType();
  };

  ValidationContext.prototype.getFieldDef = function getFieldDef() {
    return this._typeInfo.getFieldDef();
  };

  ValidationContext.prototype.getDirective = function getDirective() {
    return this._typeInfo.getDirective();
  };

  ValidationContext.prototype.getArgument = function getArgument() {
    return this._typeInfo.getArgument();
  };

  return ValidationContext;
}();

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specifiedRules = undefined;

var _UniqueOperationNames = __webpack_require__(81);

var _LoneAnonymousOperation = __webpack_require__(82);

var _SingleFieldSubscriptions = __webpack_require__(83);

var _KnownTypeNames = __webpack_require__(84);

var _FragmentsOnCompositeTypes = __webpack_require__(85);

var _VariablesAreInputTypes = __webpack_require__(86);

var _ScalarLeafs = __webpack_require__(87);

var _FieldsOnCorrectType = __webpack_require__(88);

var _UniqueFragmentNames = __webpack_require__(89);

var _KnownFragmentNames = __webpack_require__(90);

var _NoUnusedFragments = __webpack_require__(91);

var _PossibleFragmentSpreads = __webpack_require__(92);

var _NoFragmentCycles = __webpack_require__(93);

var _UniqueVariableNames = __webpack_require__(94);

var _NoUndefinedVariables = __webpack_require__(95);

var _NoUnusedVariables = __webpack_require__(96);

var _KnownDirectives = __webpack_require__(97);

var _UniqueDirectivesPerLocation = __webpack_require__(98);

var _KnownArgumentNames = __webpack_require__(99);

var _UniqueArgumentNames = __webpack_require__(100);

var _ArgumentsOfCorrectType = __webpack_require__(101);

var _ProvidedNonNullArguments = __webpack_require__(102);

var _DefaultValuesOfCorrectType = __webpack_require__(103);

var _VariablesInAllowedPosition = __webpack_require__(104);

var _OverlappingFieldsCanBeMerged = __webpack_require__(105);

var _UniqueInputFieldNames = __webpack_require__(106);

/**
 * This set includes all validation rules defined by the GraphQL spec.
 *
 * The order of the rules in this list has been adjusted to lead to the
 * most clear output when encountering multiple validation errors.
 */


// Spec Section: "Field Selection Merging"


// Spec Section: "Variable Default Values Are Correctly Typed"


// Spec Section: "Argument Values Type Correctness"


// Spec Section: "Argument Names"


// Spec Section: "Directives Are Defined"


// Spec Section: "All Variable Used Defined"


// Spec Section: "Fragments must not form cycles"


// Spec Section: "Fragments must be used"


// Spec Section: "Fragment Name Uniqueness"


// Spec Section: "Leaf Field Selections"


// Spec Section: "Fragments on Composite Types"


// Spec Section: "Subscriptions with Single Root Field"

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Spec Section: "Operation Name Uniqueness"
var specifiedRules = exports.specifiedRules = [_UniqueOperationNames.UniqueOperationNames, _LoneAnonymousOperation.LoneAnonymousOperation, _SingleFieldSubscriptions.SingleFieldSubscriptions, _KnownTypeNames.KnownTypeNames, _FragmentsOnCompositeTypes.FragmentsOnCompositeTypes, _VariablesAreInputTypes.VariablesAreInputTypes, _ScalarLeafs.ScalarLeafs, _FieldsOnCorrectType.FieldsOnCorrectType, _UniqueFragmentNames.UniqueFragmentNames, _KnownFragmentNames.KnownFragmentNames, _NoUnusedFragments.NoUnusedFragments, _PossibleFragmentSpreads.PossibleFragmentSpreads, _NoFragmentCycles.NoFragmentCycles, _UniqueVariableNames.UniqueVariableNames, _NoUndefinedVariables.NoUndefinedVariables, _NoUnusedVariables.NoUnusedVariables, _KnownDirectives.KnownDirectives, _UniqueDirectivesPerLocation.UniqueDirectivesPerLocation, _KnownArgumentNames.KnownArgumentNames, _UniqueArgumentNames.UniqueArgumentNames, _ArgumentsOfCorrectType.ArgumentsOfCorrectType, _ProvidedNonNullArguments.ProvidedNonNullArguments, _DefaultValuesOfCorrectType.DefaultValuesOfCorrectType, _VariablesInAllowedPosition.VariablesInAllowedPosition, _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged, _UniqueInputFieldNames.UniqueInputFieldNames];

// Spec Section: "Input Object Field Uniqueness"


// Spec Section: "All Variable Usages Are Allowed"


// Spec Section: "Argument Optionality"


// Spec Section: "Argument Uniqueness"


// Spec Section: "Directives Are Unique Per Location"


// Spec Section: "All Variables Used"


// Spec Section: "Variable Uniqueness"


// Spec Section: "Fragment spread is possible"


// Spec Section: "Fragment spread target defined"


// Spec Section: "Field Selections on Objects, Interfaces, and Unions Types"


// Spec Section: "Variables are Input Types"


// Spec Section: "Fragment Spread Type Existence"


// Spec Section: "Lone Anonymous Operation"

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateOperationNameMessage = duplicateOperationNameMessage;
exports.UniqueOperationNames = UniqueOperationNames;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function duplicateOperationNameMessage(operationName) {
  return 'There can be only one operation named "' + operationName + '".';
}

/**
 * Unique operation names
 *
 * A GraphQL document is only valid if all defined operations have unique names.
 */
function UniqueOperationNames(context) {
  var knownOperationNames = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition(node) {
      var operationName = node.name;
      if (operationName) {
        if (knownOperationNames[operationName.value]) {
          context.reportError(new _error.GraphQLError(duplicateOperationNameMessage(operationName.value), [knownOperationNames[operationName.value], operationName]));
        } else {
          knownOperationNames[operationName.value] = operationName;
        }
      }
      return false;
    },

    FragmentDefinition: function FragmentDefinition() {
      return false;
    }
  };
}

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anonOperationNotAloneMessage = anonOperationNotAloneMessage;
exports.LoneAnonymousOperation = LoneAnonymousOperation;

var _error = __webpack_require__(0);

var _kinds = __webpack_require__(2);

function anonOperationNotAloneMessage() {
  return 'This anonymous operation must be the only defined operation.';
}

/**
 * Lone anonymous operation
 *
 * A GraphQL document is only valid if when it contains an anonymous operation
 * (the query short-hand) that it contains only that one operation definition.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function LoneAnonymousOperation(context) {
  var operationCount = 0;
  return {
    Document: function Document(node) {
      operationCount = node.definitions.filter(function (definition) {
        return definition.kind === _kinds.OPERATION_DEFINITION;
      }).length;
    },
    OperationDefinition: function OperationDefinition(node) {
      if (!node.name && operationCount > 1) {
        context.reportError(new _error.GraphQLError(anonOperationNotAloneMessage(), [node]));
      }
    }
  };
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singleFieldOnlyMessage = singleFieldOnlyMessage;
exports.SingleFieldSubscriptions = SingleFieldSubscriptions;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function singleFieldOnlyMessage(name) {
  return (name ? 'Subscription "' + name + '" ' : 'Anonymous Subscription ') + 'must select only one top level field.';
}

/**
 * Subscriptions must only include one field.
 *
 * A GraphQL subscription is valid only if it contains a single root field.
 */
function SingleFieldSubscriptions(context) {
  return {
    OperationDefinition: function OperationDefinition(node) {
      if (node.operation === 'subscription') {
        if (node.selectionSet.selections.length !== 1) {
          context.reportError(new _error.GraphQLError(singleFieldOnlyMessage(node.name && node.name.value), node.selectionSet.selections.slice(1)));
        }
      }
    }
  };
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unknownTypeMessage = unknownTypeMessage;
exports.KnownTypeNames = KnownTypeNames;

var _error = __webpack_require__(0);

var _suggestionList = __webpack_require__(53);

var _suggestionList2 = _interopRequireDefault(_suggestionList);

var _quotedOrList = __webpack_require__(54);

var _quotedOrList2 = _interopRequireDefault(_quotedOrList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function unknownTypeMessage(type, suggestedTypes) {
  var message = 'Unknown type "' + String(type) + '".';
  if (suggestedTypes.length) {
    message += ' Did you mean ' + (0, _quotedOrList2.default)(suggestedTypes) + '?';
  }
  return message;
}

/**
 * Known type names
 *
 * A GraphQL document is only valid if referenced types (specifically
 * variable definitions and fragment conditions) are defined by the type schema.
 */
function KnownTypeNames(context) {
  return {
    // TODO: when validating IDL, re-enable these. Experimental version does not
    // add unreferenced types, resulting in false-positive errors. Squelched
    // errors for now.
    ObjectTypeDefinition: function ObjectTypeDefinition() {
      return false;
    },
    InterfaceTypeDefinition: function InterfaceTypeDefinition() {
      return false;
    },
    UnionTypeDefinition: function UnionTypeDefinition() {
      return false;
    },
    InputObjectTypeDefinition: function InputObjectTypeDefinition() {
      return false;
    },
    NamedType: function NamedType(node) {
      var schema = context.getSchema();
      var typeName = node.name.value;
      var type = schema.getType(typeName);
      if (!type) {
        context.reportError(new _error.GraphQLError(unknownTypeMessage(typeName, (0, _suggestionList2.default)(typeName, Object.keys(schema.getTypeMap()))), [node]));
      }
    }
  };
}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineFragmentOnNonCompositeErrorMessage = inlineFragmentOnNonCompositeErrorMessage;
exports.fragmentOnNonCompositeErrorMessage = fragmentOnNonCompositeErrorMessage;
exports.FragmentsOnCompositeTypes = FragmentsOnCompositeTypes;

var _error = __webpack_require__(0);

var _printer = __webpack_require__(7);

var _definition = __webpack_require__(1);

var _typeFromAST = __webpack_require__(11);

function inlineFragmentOnNonCompositeErrorMessage(type) {
  return 'Fragment cannot condition on non composite type "' + String(type) + '".';
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function fragmentOnNonCompositeErrorMessage(fragName, type) {
  return 'Fragment "' + fragName + '" cannot condition on non composite ' + ('type "' + String(type) + '".');
}

/**
 * Fragments on composite type
 *
 * Fragments use a type condition to determine if they apply, since fragments
 * can only be spread into a composite type (object, interface, or union), the
 * type condition must also be a composite type.
 */
function FragmentsOnCompositeTypes(context) {
  return {
    InlineFragment: function InlineFragment(node) {
      if (node.typeCondition) {
        var type = (0, _typeFromAST.typeFromAST)(context.getSchema(), node.typeCondition);
        if (type && !(0, _definition.isCompositeType)(type)) {
          context.reportError(new _error.GraphQLError(inlineFragmentOnNonCompositeErrorMessage((0, _printer.print)(node.typeCondition)), [node.typeCondition]));
        }
      }
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var type = (0, _typeFromAST.typeFromAST)(context.getSchema(), node.typeCondition);
      if (type && !(0, _definition.isCompositeType)(type)) {
        context.reportError(new _error.GraphQLError(fragmentOnNonCompositeErrorMessage(node.name.value, (0, _printer.print)(node.typeCondition)), [node.typeCondition]));
      }
    }
  };
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nonInputTypeOnVarMessage = nonInputTypeOnVarMessage;
exports.VariablesAreInputTypes = VariablesAreInputTypes;

var _error = __webpack_require__(0);

var _printer = __webpack_require__(7);

var _definition = __webpack_require__(1);

var _typeFromAST = __webpack_require__(11);

function nonInputTypeOnVarMessage(variableName, typeName) {
  return 'Variable "$' + variableName + '" cannot be non-input type "' + typeName + '".';
}

/**
 * Variables are input types
 *
 * A GraphQL operation is only valid if all the variables it defines are of
 * input types (scalar, enum, or input object).
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function VariablesAreInputTypes(context) {
  return {
    VariableDefinition: function VariableDefinition(node) {
      var type = (0, _typeFromAST.typeFromAST)(context.getSchema(), node.type);

      // If the variable type is not an input type, return an error.
      if (type && !(0, _definition.isInputType)(type)) {
        var variableName = node.variable.name.value;
        context.reportError(new _error.GraphQLError(nonInputTypeOnVarMessage(variableName, (0, _printer.print)(node.type)), [node.type]));
      }
    }
  };
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noSubselectionAllowedMessage = noSubselectionAllowedMessage;
exports.requiredSubselectionMessage = requiredSubselectionMessage;
exports.ScalarLeafs = ScalarLeafs;

var _error = __webpack_require__(0);

var _definition = __webpack_require__(1);

function noSubselectionAllowedMessage(fieldName, type) {
  return 'Field "' + fieldName + '" must not have a selection since ' + ('type "' + String(type) + '" has no subfields.');
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function requiredSubselectionMessage(fieldName, type) {
  return 'Field "' + fieldName + '" of type "' + String(type) + '" must have a ' + ('selection of subfields. Did you mean "' + fieldName + ' { ... }"?');
}

/**
 * Scalar leafs
 *
 * A GraphQL document is valid only if all leaf fields (fields without
 * sub selections) are of scalar or enum types.
 */
function ScalarLeafs(context) {
  return {
    Field: function Field(node) {
      var type = context.getType();
      if (type) {
        if ((0, _definition.isLeafType)((0, _definition.getNamedType)(type))) {
          if (node.selectionSet) {
            context.reportError(new _error.GraphQLError(noSubselectionAllowedMessage(node.name.value, type), [node.selectionSet]));
          }
        } else if (!node.selectionSet) {
          context.reportError(new _error.GraphQLError(requiredSubselectionMessage(node.name.value, type), [node]));
        }
      }
    }
  };
}

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.undefinedFieldMessage = undefinedFieldMessage;
exports.FieldsOnCorrectType = FieldsOnCorrectType;

var _error = __webpack_require__(0);

var _suggestionList = __webpack_require__(53);

var _suggestionList2 = _interopRequireDefault(_suggestionList);

var _quotedOrList = __webpack_require__(54);

var _quotedOrList2 = _interopRequireDefault(_quotedOrList);

var _definition = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function undefinedFieldMessage(fieldName, type, suggestedTypeNames, suggestedFieldNames) {
  var message = 'Cannot query field "' + fieldName + '" on type "' + type + '".';
  if (suggestedTypeNames.length !== 0) {
    var suggestions = (0, _quotedOrList2.default)(suggestedTypeNames);
    message += ' Did you mean to use an inline fragment on ' + suggestions + '?';
  } else if (suggestedFieldNames.length !== 0) {
    message += ' Did you mean ' + (0, _quotedOrList2.default)(suggestedFieldNames) + '?';
  }
  return message;
}

/**
 * Fields on correct type
 *
 * A GraphQL document is only valid if all fields selected are defined by the
 * parent type, or are an allowed meta field such as __typename.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function FieldsOnCorrectType(context) {
  return {
    Field: function Field(node) {
      var type = context.getParentType();
      if (type) {
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          // This field doesn't exist, lets look for suggestions.
          var schema = context.getSchema();
          var fieldName = node.name.value;
          // First determine if there are any suggested types to condition on.
          var suggestedTypeNames = getSuggestedTypeNames(schema, type, fieldName);
          // If there are no suggested types, then perhaps this was a typo?
          var suggestedFieldNames = suggestedTypeNames.length !== 0 ? [] : getSuggestedFieldNames(schema, type, fieldName);

          // Report an error, including helpful suggestions.
          context.reportError(new _error.GraphQLError(undefinedFieldMessage(fieldName, type.name, suggestedTypeNames, suggestedFieldNames), [node]));
        }
      }
    }
  };
}

/**
 * Go through all of the implementations of type, as well as the interfaces
 * that they implement. If any of those types include the provided field,
 * suggest them, sorted by how often the type is referenced,  starting
 * with Interfaces.
 */
function getSuggestedTypeNames(schema, type, fieldName) {
  if ((0, _definition.isAbstractType)(type)) {
    var suggestedObjectTypes = [];
    var interfaceUsageCount = Object.create(null);
    schema.getPossibleTypes(type).forEach(function (possibleType) {
      if (!possibleType.getFields()[fieldName]) {
        return;
      }
      // This object type defines this field.
      suggestedObjectTypes.push(possibleType.name);
      possibleType.getInterfaces().forEach(function (possibleInterface) {
        if (!possibleInterface.getFields()[fieldName]) {
          return;
        }
        // This interface type defines this field.
        interfaceUsageCount[possibleInterface.name] = (interfaceUsageCount[possibleInterface.name] || 0) + 1;
      });
    });

    // Suggest interface types based on how common they are.
    var suggestedInterfaceTypes = Object.keys(interfaceUsageCount).sort(function (a, b) {
      return interfaceUsageCount[b] - interfaceUsageCount[a];
    });

    // Suggest both interface and object types.
    return suggestedInterfaceTypes.concat(suggestedObjectTypes);
  }

  // Otherwise, must be an Object type, which does not have possible fields.
  return [];
}

/**
 * For the field name provided, determine if there are any similar field names
 * that may be the result of a typo.
 */
function getSuggestedFieldNames(schema, type, fieldName) {
  if (type instanceof _definition.GraphQLObjectType || type instanceof _definition.GraphQLInterfaceType) {
    var possibleFieldNames = Object.keys(type.getFields());
    return (0, _suggestionList2.default)(fieldName, possibleFieldNames);
  }
  // Otherwise, must be a Union type, which does not define fields.
  return [];
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateFragmentNameMessage = duplicateFragmentNameMessage;
exports.UniqueFragmentNames = UniqueFragmentNames;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function duplicateFragmentNameMessage(fragName) {
  return 'There can be only one fragment named "' + fragName + '".';
}

/**
 * Unique fragment names
 *
 * A GraphQL document is only valid if all defined fragments have unique names.
 */
function UniqueFragmentNames(context) {
  var knownFragmentNames = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var fragmentName = node.name.value;
      if (knownFragmentNames[fragmentName]) {
        context.reportError(new _error.GraphQLError(duplicateFragmentNameMessage(fragmentName), [knownFragmentNames[fragmentName], node.name]));
      } else {
        knownFragmentNames[fragmentName] = node.name;
      }
      return false;
    }
  };
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unknownFragmentMessage = unknownFragmentMessage;
exports.KnownFragmentNames = KnownFragmentNames;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function unknownFragmentMessage(fragName) {
  return 'Unknown fragment "' + fragName + '".';
}

/**
 * Known fragment names
 *
 * A GraphQL document is only valid if all `...Fragment` fragment spreads refer
 * to fragments defined in the same document.
 */
function KnownFragmentNames(context) {
  return {
    FragmentSpread: function FragmentSpread(node) {
      var fragmentName = node.name.value;
      var fragment = context.getFragment(fragmentName);
      if (!fragment) {
        context.reportError(new _error.GraphQLError(unknownFragmentMessage(fragmentName), [node.name]));
      }
    }
  };
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unusedFragMessage = unusedFragMessage;
exports.NoUnusedFragments = NoUnusedFragments;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function unusedFragMessage(fragName) {
  return 'Fragment "' + fragName + '" is never used.';
}

/**
 * No unused fragments
 *
 * A GraphQL document is only valid if all fragment definitions are spread
 * within operations, or spread within other fragments spread within operations.
 */
function NoUnusedFragments(context) {
  var operationDefs = [];
  var fragmentDefs = [];

  return {
    OperationDefinition: function OperationDefinition(node) {
      operationDefs.push(node);
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      fragmentDefs.push(node);
      return false;
    },

    Document: {
      leave: function leave() {
        var fragmentNameUsed = Object.create(null);
        operationDefs.forEach(function (operation) {
          context.getRecursivelyReferencedFragments(operation).forEach(function (fragment) {
            fragmentNameUsed[fragment.name.value] = true;
          });
        });

        fragmentDefs.forEach(function (fragmentDef) {
          var fragName = fragmentDef.name.value;
          if (fragmentNameUsed[fragName] !== true) {
            context.reportError(new _error.GraphQLError(unusedFragMessage(fragName), [fragmentDef]));
          }
        });
      }
    }
  };
}

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeIncompatibleSpreadMessage = typeIncompatibleSpreadMessage;
exports.typeIncompatibleAnonSpreadMessage = typeIncompatibleAnonSpreadMessage;
exports.PossibleFragmentSpreads = PossibleFragmentSpreads;

var _error = __webpack_require__(0);

var _typeComparators = __webpack_require__(35);

var _typeFromAST = __webpack_require__(11);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function typeIncompatibleSpreadMessage(fragName, parentType, fragType) {
  return 'Fragment "' + fragName + '" cannot be spread here as objects of ' + ('type "' + String(parentType) + '" can never be of type "' + String(fragType) + '".');
}

function typeIncompatibleAnonSpreadMessage(parentType, fragType) {
  return 'Fragment cannot be spread here as objects of ' + ('type "' + String(parentType) + '" can never be of type "' + String(fragType) + '".');
}

/**
 * Possible fragment spread
 *
 * A fragment spread is only valid if the type condition could ever possibly
 * be true: if there is a non-empty intersection of the possible parent types,
 * and possible types which pass the type condition.
 */
function PossibleFragmentSpreads(context) {
  return {
    InlineFragment: function InlineFragment(node) {
      var fragType = context.getType();
      var parentType = context.getParentType();
      if (fragType && parentType && !(0, _typeComparators.doTypesOverlap)(context.getSchema(), fragType, parentType)) {
        context.reportError(new _error.GraphQLError(typeIncompatibleAnonSpreadMessage(parentType, fragType), [node]));
      }
    },
    FragmentSpread: function FragmentSpread(node) {
      var fragName = node.name.value;
      var fragType = getFragmentType(context, fragName);
      var parentType = context.getParentType();
      if (fragType && parentType && !(0, _typeComparators.doTypesOverlap)(context.getSchema(), fragType, parentType)) {
        context.reportError(new _error.GraphQLError(typeIncompatibleSpreadMessage(fragName, parentType, fragType), [node]));
      }
    }
  };
}

function getFragmentType(context, name) {
  var frag = context.getFragment(name);
  return frag && (0, _typeFromAST.typeFromAST)(context.getSchema(), frag.typeCondition);
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cycleErrorMessage = cycleErrorMessage;
exports.NoFragmentCycles = NoFragmentCycles;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function cycleErrorMessage(fragName, spreadNames) {
  var via = spreadNames.length ? ' via ' + spreadNames.join(', ') : '';
  return 'Cannot spread fragment "' + fragName + '" within itself' + via + '.';
}

function NoFragmentCycles(context) {
  // Tracks already visited fragments to maintain O(N) and to ensure that cycles
  // are not redundantly reported.
  var visitedFrags = Object.create(null);

  // Array of AST nodes used to produce meaningful errors
  var spreadPath = [];

  // Position in the spread path
  var spreadPathIndexByName = Object.create(null);

  return {
    OperationDefinition: function OperationDefinition() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition(node) {
      if (!visitedFrags[node.name.value]) {
        detectCycleRecursive(node);
      }
      return false;
    }
  };

  // This does a straight-forward DFS to find cycles.
  // It does not terminate when a cycle was found but continues to explore
  // the graph to find all possible cycles.
  function detectCycleRecursive(fragment) {
    var fragmentName = fragment.name.value;
    visitedFrags[fragmentName] = true;

    var spreadNodes = context.getFragmentSpreads(fragment.selectionSet);
    if (spreadNodes.length === 0) {
      return;
    }

    spreadPathIndexByName[fragmentName] = spreadPath.length;

    for (var i = 0; i < spreadNodes.length; i++) {
      var spreadNode = spreadNodes[i];
      var spreadName = spreadNode.name.value;
      var cycleIndex = spreadPathIndexByName[spreadName];

      if (cycleIndex === undefined) {
        spreadPath.push(spreadNode);
        if (!visitedFrags[spreadName]) {
          var spreadFragment = context.getFragment(spreadName);
          if (spreadFragment) {
            detectCycleRecursive(spreadFragment);
          }
        }
        spreadPath.pop();
      } else {
        var cyclePath = spreadPath.slice(cycleIndex);
        context.reportError(new _error.GraphQLError(cycleErrorMessage(spreadName, cyclePath.map(function (s) {
          return s.name.value;
        })), cyclePath.concat(spreadNode)));
      }
    }

    spreadPathIndexByName[fragmentName] = undefined;
  }
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateVariableMessage = duplicateVariableMessage;
exports.UniqueVariableNames = UniqueVariableNames;

var _error = __webpack_require__(0);

function duplicateVariableMessage(variableName) {
  return 'There can be only one variable named "' + variableName + '".';
}

/**
 * Unique variable names
 *
 * A GraphQL operation is only valid if all its variables are uniquely named.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function UniqueVariableNames(context) {
  var knownVariableNames = Object.create(null);
  return {
    OperationDefinition: function OperationDefinition() {
      knownVariableNames = Object.create(null);
    },
    VariableDefinition: function VariableDefinition(node) {
      var variableName = node.variable.name.value;
      if (knownVariableNames[variableName]) {
        context.reportError(new _error.GraphQLError(duplicateVariableMessage(variableName), [knownVariableNames[variableName], node.variable.name]));
      } else {
        knownVariableNames[variableName] = node.variable.name;
      }
    }
  };
}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.undefinedVarMessage = undefinedVarMessage;
exports.NoUndefinedVariables = NoUndefinedVariables;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function undefinedVarMessage(varName, opName) {
  return opName ? 'Variable "$' + varName + '" is not defined by operation "' + opName + '".' : 'Variable "$' + varName + '" is not defined.';
}

/**
 * No undefined variables
 *
 * A GraphQL operation is only valid if all variables encountered, both directly
 * and via fragment spreads, are defined by that operation.
 */
function NoUndefinedVariables(context) {
  var variableNameDefined = Object.create(null);

  return {
    OperationDefinition: {
      enter: function enter() {
        variableNameDefined = Object.create(null);
      },
      leave: function leave(operation) {
        var usages = context.getRecursiveVariableUsages(operation);

        usages.forEach(function (_ref) {
          var node = _ref.node;

          var varName = node.name.value;
          if (variableNameDefined[varName] !== true) {
            context.reportError(new _error.GraphQLError(undefinedVarMessage(varName, operation.name && operation.name.value), [node, operation]));
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(node) {
      variableNameDefined[node.variable.name.value] = true;
    }
  };
}

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unusedVariableMessage = unusedVariableMessage;
exports.NoUnusedVariables = NoUnusedVariables;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function unusedVariableMessage(varName, opName) {
  return opName ? 'Variable "$' + varName + '" is never used in operation "' + opName + '".' : 'Variable "$' + varName + '" is never used.';
}

/**
 * No unused variables
 *
 * A GraphQL operation is only valid if all variables defined by an operation
 * are used, either directly or within a spread fragment.
 */
function NoUnusedVariables(context) {
  var variableDefs = [];

  return {
    OperationDefinition: {
      enter: function enter() {
        variableDefs = [];
      },
      leave: function leave(operation) {
        var variableNameUsed = Object.create(null);
        var usages = context.getRecursiveVariableUsages(operation);
        var opName = operation.name ? operation.name.value : null;

        usages.forEach(function (_ref) {
          var node = _ref.node;

          variableNameUsed[node.name.value] = true;
        });

        variableDefs.forEach(function (variableDef) {
          var variableName = variableDef.variable.name.value;
          if (variableNameUsed[variableName] !== true) {
            context.reportError(new _error.GraphQLError(unusedVariableMessage(variableName, opName), [variableDef]));
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(def) {
      variableDefs.push(def);
    }
  };
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unknownDirectiveMessage = unknownDirectiveMessage;
exports.misplacedDirectiveMessage = misplacedDirectiveMessage;
exports.KnownDirectives = KnownDirectives;

var _error = __webpack_require__(0);

var _find = __webpack_require__(20);

var _find2 = _interopRequireDefault(_find);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _directives = __webpack_require__(10);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function unknownDirectiveMessage(directiveName) {
  return 'Unknown directive "' + directiveName + '".';
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function misplacedDirectiveMessage(directiveName, location) {
  return 'Directive "' + directiveName + '" may not be used on ' + location + '.';
}

/**
 * Known directives
 *
 * A GraphQL document is only valid if all `@directives` are known by the
 * schema and legally positioned.
 */
function KnownDirectives(context) {
  return {
    Directive: function Directive(node, key, parent, path, ancestors) {
      var directiveDef = (0, _find2.default)(context.getSchema().getDirectives(), function (def) {
        return def.name === node.name.value;
      });
      if (!directiveDef) {
        context.reportError(new _error.GraphQLError(unknownDirectiveMessage(node.name.value), [node]));
        return;
      }
      var candidateLocation = getDirectiveLocationForASTPath(ancestors);
      if (!candidateLocation) {
        context.reportError(new _error.GraphQLError(misplacedDirectiveMessage(node.name.value, node.type), [node]));
      } else if (directiveDef.locations.indexOf(candidateLocation) === -1) {
        context.reportError(new _error.GraphQLError(misplacedDirectiveMessage(node.name.value, candidateLocation), [node]));
      }
    }
  };
}

function getDirectiveLocationForASTPath(ancestors) {
  var appliedTo = ancestors[ancestors.length - 1];
  switch (appliedTo.kind) {
    case Kind.OPERATION_DEFINITION:
      switch (appliedTo.operation) {
        case 'query':
          return _directives.DirectiveLocation.QUERY;
        case 'mutation':
          return _directives.DirectiveLocation.MUTATION;
        case 'subscription':
          return _directives.DirectiveLocation.SUBSCRIPTION;
      }
      break;
    case Kind.FIELD:
      return _directives.DirectiveLocation.FIELD;
    case Kind.FRAGMENT_SPREAD:
      return _directives.DirectiveLocation.FRAGMENT_SPREAD;
    case Kind.INLINE_FRAGMENT:
      return _directives.DirectiveLocation.INLINE_FRAGMENT;
    case Kind.FRAGMENT_DEFINITION:
      return _directives.DirectiveLocation.FRAGMENT_DEFINITION;
    case Kind.SCHEMA_DEFINITION:
      return _directives.DirectiveLocation.SCHEMA;
    case Kind.SCALAR_TYPE_DEFINITION:
      return _directives.DirectiveLocation.SCALAR;
    case Kind.OBJECT_TYPE_DEFINITION:
      return _directives.DirectiveLocation.OBJECT;
    case Kind.FIELD_DEFINITION:
      return _directives.DirectiveLocation.FIELD_DEFINITION;
    case Kind.INTERFACE_TYPE_DEFINITION:
      return _directives.DirectiveLocation.INTERFACE;
    case Kind.UNION_TYPE_DEFINITION:
      return _directives.DirectiveLocation.UNION;
    case Kind.ENUM_TYPE_DEFINITION:
      return _directives.DirectiveLocation.ENUM;
    case Kind.ENUM_VALUE_DEFINITION:
      return _directives.DirectiveLocation.ENUM_VALUE;
    case Kind.INPUT_OBJECT_TYPE_DEFINITION:
      return _directives.DirectiveLocation.INPUT_OBJECT;
    case Kind.INPUT_VALUE_DEFINITION:
      var parentNode = ancestors[ancestors.length - 3];
      return parentNode.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION ? _directives.DirectiveLocation.INPUT_FIELD_DEFINITION : _directives.DirectiveLocation.ARGUMENT_DEFINITION;
  }
}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateDirectiveMessage = duplicateDirectiveMessage;
exports.UniqueDirectivesPerLocation = UniqueDirectivesPerLocation;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function duplicateDirectiveMessage(directiveName) {
  return 'The directive "' + directiveName + '" can only be used once at ' + 'this location.';
}

/**
 * Unique directive names per location
 *
 * A GraphQL document is only valid if all directives at a given location
 * are uniquely named.
 */
function UniqueDirectivesPerLocation(context) {
  return {
    // Many different AST nodes may contain directives. Rather than listing
    // them all, just listen for entering any node, and check to see if it
    // defines any directives.
    enter: function enter(node) {
      if (node.directives) {
        var knownDirectives = Object.create(null);
        node.directives.forEach(function (directive) {
          var directiveName = directive.name.value;
          if (knownDirectives[directiveName]) {
            context.reportError(new _error.GraphQLError(duplicateDirectiveMessage(directiveName), [knownDirectives[directiveName], directive]));
          } else {
            knownDirectives[directiveName] = directive;
          }
        });
      }
    }
  };
}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unknownArgMessage = unknownArgMessage;
exports.unknownDirectiveArgMessage = unknownDirectiveArgMessage;
exports.KnownArgumentNames = KnownArgumentNames;

var _error = __webpack_require__(0);

var _find = __webpack_require__(20);

var _find2 = _interopRequireDefault(_find);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _suggestionList = __webpack_require__(53);

var _suggestionList2 = _interopRequireDefault(_suggestionList);

var _quotedOrList = __webpack_require__(54);

var _quotedOrList2 = _interopRequireDefault(_quotedOrList);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function unknownArgMessage(argName, fieldName, type, suggestedArgs) {
  var message = 'Unknown argument "' + argName + '" on field "' + fieldName + '" of ' + ('type "' + String(type) + '".');
  if (suggestedArgs.length) {
    message += ' Did you mean ' + (0, _quotedOrList2.default)(suggestedArgs) + '?';
  }
  return message;
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function unknownDirectiveArgMessage(argName, directiveName, suggestedArgs) {
  var message = 'Unknown argument "' + argName + '" on directive "@' + directiveName + '".';
  if (suggestedArgs.length) {
    message += ' Did you mean ' + (0, _quotedOrList2.default)(suggestedArgs) + '?';
  }
  return message;
}

/**
 * Known argument names
 *
 * A GraphQL field is only valid if all supplied arguments are defined by
 * that field.
 */
function KnownArgumentNames(context) {
  return {
    Argument: function Argument(node, key, parent, path, ancestors) {
      var argumentOf = ancestors[ancestors.length - 1];
      if (argumentOf.kind === Kind.FIELD) {
        var fieldDef = context.getFieldDef();
        if (fieldDef) {
          var fieldArgDef = (0, _find2.default)(fieldDef.args, function (arg) {
            return arg.name === node.name.value;
          });
          if (!fieldArgDef) {
            var parentType = context.getParentType();
            (0, _invariant2.default)(parentType);
            context.reportError(new _error.GraphQLError(unknownArgMessage(node.name.value, fieldDef.name, parentType.name, (0, _suggestionList2.default)(node.name.value, fieldDef.args.map(function (arg) {
              return arg.name;
            }))), [node]));
          }
        }
      } else if (argumentOf.kind === Kind.DIRECTIVE) {
        var directive = context.getDirective();
        if (directive) {
          var directiveArgDef = (0, _find2.default)(directive.args, function (arg) {
            return arg.name === node.name.value;
          });
          if (!directiveArgDef) {
            context.reportError(new _error.GraphQLError(unknownDirectiveArgMessage(node.name.value, directive.name, (0, _suggestionList2.default)(node.name.value, directive.args.map(function (arg) {
              return arg.name;
            }))), [node]));
          }
        }
      }
    }
  };
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateArgMessage = duplicateArgMessage;
exports.UniqueArgumentNames = UniqueArgumentNames;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function duplicateArgMessage(argName) {
  return 'There can be only one argument named "' + argName + '".';
}

/**
 * Unique argument names
 *
 * A GraphQL field or directive is only valid if all supplied arguments are
 * uniquely named.
 */
function UniqueArgumentNames(context) {
  var knownArgNames = Object.create(null);
  return {
    Field: function Field() {
      knownArgNames = Object.create(null);
    },
    Directive: function Directive() {
      knownArgNames = Object.create(null);
    },
    Argument: function Argument(node) {
      var argName = node.name.value;
      if (knownArgNames[argName]) {
        context.reportError(new _error.GraphQLError(duplicateArgMessage(argName), [knownArgNames[argName], node.name]));
      } else {
        knownArgNames[argName] = node.name;
      }
      return false;
    }
  };
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.badValueMessage = badValueMessage;
exports.ArgumentsOfCorrectType = ArgumentsOfCorrectType;

var _error = __webpack_require__(0);

var _printer = __webpack_require__(7);

var _isValidLiteralValue = __webpack_require__(36);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function badValueMessage(argName, type, value, verboseErrors) {
  var message = verboseErrors ? '\n' + verboseErrors.join('\n') : '';
  return 'Argument "' + argName + '" has invalid value ' + value + '.' + message;
}

/**
 * Argument values of correct type
 *
 * A GraphQL document is only valid if all field argument literal values are
 * of the type expected by their position.
 */
function ArgumentsOfCorrectType(context) {
  return {
    Argument: function Argument(node) {
      var argDef = context.getArgument();
      if (argDef) {
        var errors = (0, _isValidLiteralValue.isValidLiteralValue)(argDef.type, node.value);
        if (errors && errors.length > 0) {
          context.reportError(new _error.GraphQLError(badValueMessage(node.name.value, argDef.type, (0, _printer.print)(node.value), errors), [node.value]));
        }
      }
      return false;
    }
  };
}

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.missingFieldArgMessage = missingFieldArgMessage;
exports.missingDirectiveArgMessage = missingDirectiveArgMessage;
exports.ProvidedNonNullArguments = ProvidedNonNullArguments;

var _error = __webpack_require__(0);

var _keyMap = __webpack_require__(21);

var _keyMap2 = _interopRequireDefault(_keyMap);

var _definition = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function missingFieldArgMessage(fieldName, argName, type) {
  return 'Field "' + fieldName + '" argument "' + argName + '" of type ' + ('"' + String(type) + '" is required but not provided.');
}

function missingDirectiveArgMessage(directiveName, argName, type) {
  return 'Directive "@' + directiveName + '" argument "' + argName + '" of type ' + ('"' + String(type) + '" is required but not provided.');
}

/**
 * Provided required arguments
 *
 * A field or directive is only valid if all required (non-null) field arguments
 * have been provided.
 */
function ProvidedNonNullArguments(context) {
  return {
    Field: {
      // Validate on leave to allow for deeper errors to appear first.
      leave: function leave(node) {
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          return false;
        }
        var argNodes = node.arguments || [];

        var argNodeMap = (0, _keyMap2.default)(argNodes, function (arg) {
          return arg.name.value;
        });
        fieldDef.args.forEach(function (argDef) {
          var argNode = argNodeMap[argDef.name];
          if (!argNode && argDef.type instanceof _definition.GraphQLNonNull) {
            context.reportError(new _error.GraphQLError(missingFieldArgMessage(node.name.value, argDef.name, argDef.type), [node]));
          }
        });
      }
    },

    Directive: {
      // Validate on leave to allow for deeper errors to appear first.
      leave: function leave(node) {
        var directiveDef = context.getDirective();
        if (!directiveDef) {
          return false;
        }
        var argNodes = node.arguments || [];

        var argNodeMap = (0, _keyMap2.default)(argNodes, function (arg) {
          return arg.name.value;
        });
        directiveDef.args.forEach(function (argDef) {
          var argNode = argNodeMap[argDef.name];
          if (!argNode && argDef.type instanceof _definition.GraphQLNonNull) {
            context.reportError(new _error.GraphQLError(missingDirectiveArgMessage(node.name.value, argDef.name, argDef.type), [node]));
          }
        });
      }
    }
  };
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultForNonNullArgMessage = defaultForNonNullArgMessage;
exports.badValueForDefaultArgMessage = badValueForDefaultArgMessage;
exports.DefaultValuesOfCorrectType = DefaultValuesOfCorrectType;

var _error = __webpack_require__(0);

var _printer = __webpack_require__(7);

var _definition = __webpack_require__(1);

var _isValidLiteralValue = __webpack_require__(36);

function defaultForNonNullArgMessage(varName, type, guessType) {
  return 'Variable "$' + varName + '" of type "' + String(type) + '" is required and ' + 'will not use the default value. ' + ('Perhaps you meant to use type "' + String(guessType) + '".');
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function badValueForDefaultArgMessage(varName, type, value, verboseErrors) {
  var message = verboseErrors ? '\n' + verboseErrors.join('\n') : '';
  return 'Variable "$' + varName + '" of type "' + String(type) + '" has invalid ' + ('default value ' + value + '.' + message);
}

/**
 * Variable default values of correct type
 *
 * A GraphQL document is only valid if all variable default values are of the
 * type expected by their definition.
 */
function DefaultValuesOfCorrectType(context) {
  return {
    VariableDefinition: function VariableDefinition(node) {
      var name = node.variable.name.value;
      var defaultValue = node.defaultValue;
      var type = context.getInputType();
      if (type instanceof _definition.GraphQLNonNull && defaultValue) {
        context.reportError(new _error.GraphQLError(defaultForNonNullArgMessage(name, type, type.ofType), [defaultValue]));
      }
      if (type && defaultValue) {
        var errors = (0, _isValidLiteralValue.isValidLiteralValue)(type, defaultValue);
        if (errors && errors.length > 0) {
          context.reportError(new _error.GraphQLError(badValueForDefaultArgMessage(name, type, (0, _printer.print)(defaultValue), errors), [defaultValue]));
        }
      }
      return false;
    },

    SelectionSet: function SelectionSet() {
      return false;
    },
    FragmentDefinition: function FragmentDefinition() {
      return false;
    }
  };
}

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.badVarPosMessage = badVarPosMessage;
exports.VariablesInAllowedPosition = VariablesInAllowedPosition;

var _error = __webpack_require__(0);

var _definition = __webpack_require__(1);

var _typeComparators = __webpack_require__(35);

var _typeFromAST = __webpack_require__(11);

function badVarPosMessage(varName, varType, expectedType) {
  return 'Variable "$' + varName + '" of type "' + String(varType) + '" used in ' + ('position expecting type "' + String(expectedType) + '".');
}

/**
 * Variables passed to field arguments conform to type
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function VariablesInAllowedPosition(context) {
  var varDefMap = Object.create(null);

  return {
    OperationDefinition: {
      enter: function enter() {
        varDefMap = Object.create(null);
      },
      leave: function leave(operation) {
        var usages = context.getRecursiveVariableUsages(operation);

        usages.forEach(function (_ref) {
          var node = _ref.node,
              type = _ref.type;

          var varName = node.name.value;
          var varDef = varDefMap[varName];
          if (varDef && type) {
            // A var type is allowed if it is the same or more strict (e.g. is
            // a subtype of) than the expected type. It can be more strict if
            // the variable type is non-null when the expected type is nullable.
            // If both are list types, the variable item type can be more strict
            // than the expected item type (contravariant).
            var schema = context.getSchema();
            var varType = (0, _typeFromAST.typeFromAST)(schema, varDef.type);
            if (varType && !(0, _typeComparators.isTypeSubTypeOf)(schema, effectiveType(varType, varDef), type)) {
              context.reportError(new _error.GraphQLError(badVarPosMessage(varName, varType, type), [varDef, node]));
            }
          }
        });
      }
    },
    VariableDefinition: function VariableDefinition(node) {
      varDefMap[node.variable.name.value] = node;
    }
  };
}

// If a variable definition has a default value, it's effectively non-null.
function effectiveType(varType, varDef) {
  return !varDef.defaultValue || varType instanceof _definition.GraphQLNonNull ? varType : new _definition.GraphQLNonNull(varType);
}

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldsConflictMessage = fieldsConflictMessage;
exports.OverlappingFieldsCanBeMerged = OverlappingFieldsCanBeMerged;

var _error = __webpack_require__(0);

var _find = __webpack_require__(20);

var _find2 = _interopRequireDefault(_find);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _printer = __webpack_require__(7);

var _definition = __webpack_require__(1);

var _typeFromAST = __webpack_require__(11);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function fieldsConflictMessage(responseName, reason) {
  return 'Fields "' + responseName + '" conflict because ' + reasonMessage(reason) + '. Use different aliases on the fields to fetch both if this was ' + 'intentional.';
}

function reasonMessage(reason) {
  if (Array.isArray(reason)) {
    return reason.map(function (_ref) {
      var responseName = _ref[0],
          subreason = _ref[1];
      return 'subfields "' + responseName + '" conflict because ' + reasonMessage(subreason);
    }).join(' and ');
  }
  return reason;
}

/**
 * Overlapping fields can be merged
 *
 * A selection set is only valid if all fields (including spreading any
 * fragments) either correspond to distinct response names or can be merged
 * without ambiguity.
 */
function OverlappingFieldsCanBeMerged(context) {
  // A memoization for when two fragments are compared "between" each other for
  // conflicts. Two fragments may be compared many times, so memoizing this can
  // dramatically improve the performance of this validator.
  var comparedFragments = new PairSet();

  // A cache for the "field map" and list of fragment names found in any given
  // selection set. Selection sets may be asked for this information multiple
  // times, so this improves the performance of this validator.
  var cachedFieldsAndFragmentNames = new Map();

  return {
    SelectionSet: function SelectionSet(selectionSet) {
      var conflicts = findConflictsWithinSelectionSet(context, cachedFieldsAndFragmentNames, comparedFragments, context.getParentType(), selectionSet);
      conflicts.forEach(function (_ref2) {
        var _ref2$ = _ref2[0],
            responseName = _ref2$[0],
            reason = _ref2$[1],
            fields1 = _ref2[1],
            fields2 = _ref2[2];
        return context.reportError(new _error.GraphQLError(fieldsConflictMessage(responseName, reason), fields1.concat(fields2)));
      });
    }
  };
}
// Field name and reason.

// Reason is a string, or a nested list of conflicts.

// Tuple defining a field node in a context.

// Map of array of those.


/**
 * Algorithm:
 *
 * Conflicts occur when two fields exist in a query which will produce the same
 * response name, but represent differing values, thus creating a conflict.
 * The algorithm below finds all conflicts via making a series of comparisons
 * between fields. In order to compare as few fields as possible, this makes
 * a series of comparisons "within" sets of fields and "between" sets of fields.
 *
 * Given any selection set, a collection produces both a set of fields by
 * also including all inline fragments, as well as a list of fragments
 * referenced by fragment spreads.
 *
 * A) Each selection set represented in the document first compares "within" its
 * collected set of fields, finding any conflicts between every pair of
 * overlapping fields.
 * Note: This is the *only time* that a the fields "within" a set are compared
 * to each other. After this only fields "between" sets are compared.
 *
 * B) Also, if any fragment is referenced in a selection set, then a
 * comparison is made "between" the original set of fields and the
 * referenced fragment.
 *
 * C) Also, if multiple fragments are referenced, then comparisons
 * are made "between" each referenced fragment.
 *
 * D) When comparing "between" a set of fields and a referenced fragment, first
 * a comparison is made between each field in the original set of fields and
 * each field in the the referenced set of fields.
 *
 * E) Also, if any fragment is referenced in the referenced selection set,
 * then a comparison is made "between" the original set of fields and the
 * referenced fragment (recursively referring to step D).
 *
 * F) When comparing "between" two fragments, first a comparison is made between
 * each field in the first referenced set of fields and each field in the the
 * second referenced set of fields.
 *
 * G) Also, any fragments referenced by the first must be compared to the
 * second, and any fragments referenced by the second must be compared to the
 * first (recursively referring to step F).
 *
 * H) When comparing two fields, if both have selection sets, then a comparison
 * is made "between" both selection sets, first comparing the set of fields in
 * the first selection set with the set of fields in the second.
 *
 * I) Also, if any fragment is referenced in either selection set, then a
 * comparison is made "between" the other set of fields and the
 * referenced fragment.
 *
 * J) Also, if two fragments are referenced in both selection sets, then a
 * comparison is made "between" the two fragments.
 *
 */

// Find all conflicts found "within" a selection set, including those found
// via spreading in fragments. Called when visiting each SelectionSet in the
// GraphQL Document.
function findConflictsWithinSelectionSet(context, cachedFieldsAndFragmentNames, comparedFragments, parentType, selectionSet) {
  var conflicts = [];

  var _getFieldsAndFragment = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType, selectionSet),
      fieldMap = _getFieldsAndFragment[0],
      fragmentNames = _getFieldsAndFragment[1];

  // (A) Find find all conflicts "within" the fields of this selection set.
  // Note: this is the *only place* `collectConflictsWithin` is called.


  collectConflictsWithin(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, fieldMap);

  // (B) Then collect conflicts between these fields and those represented by
  // each spread fragment name found.
  for (var i = 0; i < fragmentNames.length; i++) {
    collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, false, fieldMap, fragmentNames[i]);
    // (C) Then compare this fragment with all other fragments found in this
    // selection set to collect conflicts between fragments spread together.
    // This compares each item in the list of fragment names to every other item
    // in that same list (except for itself).
    for (var j = i + 1; j < fragmentNames.length; j++) {
      collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, false, fragmentNames[i], fragmentNames[j]);
    }
  }
  return conflicts;
}

// Collect all conflicts found between a set of fields and a fragment reference
// including via spreading in any nested fragments.
function collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fieldMap, fragmentName) {
  var fragment = context.getFragment(fragmentName);
  if (!fragment) {
    return;
  }

  var _getReferencedFieldsA = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment),
      fieldMap2 = _getReferencedFieldsA[0],
      fragmentNames2 = _getReferencedFieldsA[1];

  // (D) First collect any conflicts between the provided collection of fields
  // and the collection of fields represented by the given fragment.


  collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fieldMap, fieldMap2);

  // (E) Then collect any conflicts between the provided collection of fields
  // and any fragment names found in the given fragment.
  for (var i = 0; i < fragmentNames2.length; i++) {
    collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fieldMap, fragmentNames2[i]);
  }
}

// Collect all conflicts found between two fragments, including via spreading in
// any nested fragments.
function collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fragmentName1, fragmentName2) {
  var fragment1 = context.getFragment(fragmentName1);
  var fragment2 = context.getFragment(fragmentName2);
  if (!fragment1 || !fragment2) {
    return;
  }

  // No need to compare a fragment to itself.
  if (fragment1 === fragment2) {
    return;
  }

  // Memoize so two fragments are not compared for conflicts more than once.
  if (comparedFragments.has(fragmentName1, fragmentName2, areMutuallyExclusive)) {
    return;
  }
  comparedFragments.add(fragmentName1, fragmentName2, areMutuallyExclusive);

  var _getReferencedFieldsA2 = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment1),
      fieldMap1 = _getReferencedFieldsA2[0],
      fragmentNames1 = _getReferencedFieldsA2[1];

  var _getReferencedFieldsA3 = getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment2),
      fieldMap2 = _getReferencedFieldsA3[0],
      fragmentNames2 = _getReferencedFieldsA3[1];

  // (F) First, collect all conflicts between these two collections of fields
  // (not including any nested fragments).


  collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fieldMap1, fieldMap2);

  // (G) Then collect conflicts between the first fragment and any nested
  // fragments spread in the second fragment.
  for (var j = 0; j < fragmentNames2.length; j++) {
    collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fragmentName1, fragmentNames2[j]);
  }

  // (G) Then collect conflicts between the second fragment and any nested
  // fragments spread in the first fragment.
  for (var i = 0; i < fragmentNames1.length; i++) {
    collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fragmentNames1[i], fragmentName2);
  }
}

// Find all conflicts found between two selection sets, including those found
// via spreading in fragments. Called when determining if conflicts exist
// between the sub-fields of two overlapping fields.
function findConflictsBetweenSubSelectionSets(context, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, parentType1, selectionSet1, parentType2, selectionSet2) {
  var conflicts = [];

  var _getFieldsAndFragment2 = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType1, selectionSet1),
      fieldMap1 = _getFieldsAndFragment2[0],
      fragmentNames1 = _getFieldsAndFragment2[1];

  var _getFieldsAndFragment3 = getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType2, selectionSet2),
      fieldMap2 = _getFieldsAndFragment3[0],
      fragmentNames2 = _getFieldsAndFragment3[1];

  // (H) First, collect all conflicts between these two collections of field.


  collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fieldMap1, fieldMap2);

  // (I) Then collect conflicts between the first collection of fields and
  // those referenced by each fragment name associated with the second.
  for (var j = 0; j < fragmentNames2.length; j++) {
    collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fieldMap1, fragmentNames2[j]);
  }

  // (I) Then collect conflicts between the second collection of fields and
  // those referenced by each fragment name associated with the first.
  for (var i = 0; i < fragmentNames1.length; i++) {
    collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fieldMap2, fragmentNames1[i]);
  }

  // (J) Also collect conflicts between any fragment names by the first and
  // fragment names by the second. This compares each item in the first set of
  // names to each item in the second set of names.
  for (var _i = 0; _i < fragmentNames1.length; _i++) {
    for (var _j = 0; _j < fragmentNames2.length; _j++) {
      collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, fragmentNames1[_i], fragmentNames2[_j]);
    }
  }
  return conflicts;
}

// Collect all Conflicts "within" one collection of fields.
function collectConflictsWithin(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, fieldMap) {
  // A field map is a keyed collection, where each key represents a response
  // name and the value at that key is a list of all fields which provide that
  // response name. For every response name, if there are multiple fields, they
  // must be compared to find a potential conflict.
  Object.keys(fieldMap).forEach(function (responseName) {
    var fields = fieldMap[responseName];
    // This compares every field in the list to every other field in this list
    // (except to itself). If the list only has one item, nothing needs to
    // be compared.
    if (fields.length > 1) {
      for (var i = 0; i < fields.length; i++) {
        for (var j = i + 1; j < fields.length; j++) {
          var conflict = findConflict(context, cachedFieldsAndFragmentNames, comparedFragments, false, // within one collection is never mutually exclusive
          responseName, fields[i], fields[j]);
          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  });
}

// Collect all Conflicts between two collections of fields. This is similar to,
// but different from the `collectConflictsWithin` function above. This check
// assumes that `collectConflictsWithin` has already been called on each
// provided collection of fields. This is true because this validator traverses
// each individual selection set.
function collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFragments, parentFieldsAreMutuallyExclusive, fieldMap1, fieldMap2) {
  // A field map is a keyed collection, where each key represents a response
  // name and the value at that key is a list of all fields which provide that
  // response name. For any response name which appears in both provided field
  // maps, each field from the first field map must be compared to every field
  // in the second field map to find potential conflicts.
  Object.keys(fieldMap1).forEach(function (responseName) {
    var fields2 = fieldMap2[responseName];
    if (fields2) {
      var fields1 = fieldMap1[responseName];
      for (var i = 0; i < fields1.length; i++) {
        for (var j = 0; j < fields2.length; j++) {
          var conflict = findConflict(context, cachedFieldsAndFragmentNames, comparedFragments, parentFieldsAreMutuallyExclusive, responseName, fields1[i], fields2[j]);
          if (conflict) {
            conflicts.push(conflict);
          }
        }
      }
    }
  });
}

// Determines if there is a conflict between two particular fields, including
// comparing their sub-fields.
function findConflict(context, cachedFieldsAndFragmentNames, comparedFragments, parentFieldsAreMutuallyExclusive, responseName, field1, field2) {
  var parentType1 = field1[0],
      node1 = field1[1],
      def1 = field1[2];
  var parentType2 = field2[0],
      node2 = field2[1],
      def2 = field2[2];

  // If it is known that two fields could not possibly apply at the same
  // time, due to the parent types, then it is safe to permit them to diverge
  // in aliased field or arguments used as they will not present any ambiguity
  // by differing.
  // It is known that two parent types could never overlap if they are
  // different Object types. Interface or Union types might overlap - if not
  // in the current state of the schema, then perhaps in some future version,
  // thus may not safely diverge.

  var areMutuallyExclusive = parentFieldsAreMutuallyExclusive || parentType1 !== parentType2 && parentType1 instanceof _definition.GraphQLObjectType && parentType2 instanceof _definition.GraphQLObjectType;

  // The return type for each field.
  var type1 = def1 && def1.type;
  var type2 = def2 && def2.type;

  if (!areMutuallyExclusive) {
    // Two aliases must refer to the same field.
    var name1 = node1.name.value;
    var name2 = node2.name.value;
    if (name1 !== name2) {
      return [[responseName, name1 + ' and ' + name2 + ' are different fields'], [node1], [node2]];
    }

    // Two field calls must have the same arguments.
    if (!sameArguments(node1.arguments || [], node2.arguments || [])) {
      return [[responseName, 'they have differing arguments'], [node1], [node2]];
    }
  }

  if (type1 && type2 && doTypesConflict(type1, type2)) {
    return [[responseName, 'they return conflicting types ' + String(type1) + ' and ' + String(type2)], [node1], [node2]];
  }

  // Collect and compare sub-fields. Use the same "visited fragment names" list
  // for both collections so fields in a fragment reference are never
  // compared to themselves.
  var selectionSet1 = node1.selectionSet;
  var selectionSet2 = node2.selectionSet;
  if (selectionSet1 && selectionSet2) {
    var conflicts = findConflictsBetweenSubSelectionSets(context, cachedFieldsAndFragmentNames, comparedFragments, areMutuallyExclusive, (0, _definition.getNamedType)(type1), selectionSet1, (0, _definition.getNamedType)(type2), selectionSet2);
    return subfieldConflicts(conflicts, responseName, node1, node2);
  }
}

function sameArguments(arguments1, arguments2) {
  if (arguments1.length !== arguments2.length) {
    return false;
  }
  return arguments1.every(function (argument1) {
    var argument2 = (0, _find2.default)(arguments2, function (argument) {
      return argument.name.value === argument1.name.value;
    });
    if (!argument2) {
      return false;
    }
    return sameValue(argument1.value, argument2.value);
  });
}

function sameValue(value1, value2) {
  return !value1 && !value2 || (0, _printer.print)(value1) === (0, _printer.print)(value2);
}

// Two types conflict if both types could not apply to a value simultaneously.
// Composite types are ignored as their individual field types will be compared
// later recursively. However List and Non-Null types must match.
function doTypesConflict(type1, type2) {
  if (type1 instanceof _definition.GraphQLList) {
    return type2 instanceof _definition.GraphQLList ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (type2 instanceof _definition.GraphQLList) {
    return type1 instanceof _definition.GraphQLList ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (type1 instanceof _definition.GraphQLNonNull) {
    return type2 instanceof _definition.GraphQLNonNull ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if (type2 instanceof _definition.GraphQLNonNull) {
    return type1 instanceof _definition.GraphQLNonNull ? doTypesConflict(type1.ofType, type2.ofType) : true;
  }
  if ((0, _definition.isLeafType)(type1) || (0, _definition.isLeafType)(type2)) {
    return type1 !== type2;
  }
  return false;
}

// Given a selection set, return the collection of fields (a mapping of response
// name to field nodes and definitions) as well as a list of fragment names
// referenced via fragment spreads.
function getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType, selectionSet) {
  var cached = cachedFieldsAndFragmentNames.get(selectionSet);
  if (!cached) {
    var nodeAndDefs = Object.create(null);
    var fragmentNames = Object.create(null);
    _collectFieldsAndFragmentNames(context, parentType, selectionSet, nodeAndDefs, fragmentNames);
    cached = [nodeAndDefs, Object.keys(fragmentNames)];
    cachedFieldsAndFragmentNames.set(selectionSet, cached);
  }
  return cached;
}

// Given a reference to a fragment, return the represented collection of fields
// as well as a list of nested fragment names referenced via fragment spreads.
function getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment) {
  // Short-circuit building a type from the node if possible.
  var cached = cachedFieldsAndFragmentNames.get(fragment.selectionSet);
  if (cached) {
    return cached;
  }

  var fragmentType = (0, _typeFromAST.typeFromAST)(context.getSchema(), fragment.typeCondition);
  return getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragmentType, fragment.selectionSet);
}

function _collectFieldsAndFragmentNames(context, parentType, selectionSet, nodeAndDefs, fragmentNames) {
  for (var i = 0; i < selectionSet.selections.length; i++) {
    var selection = selectionSet.selections[i];
    switch (selection.kind) {
      case Kind.FIELD:
        var fieldName = selection.name.value;
        var fieldDef = void 0;
        if (parentType instanceof _definition.GraphQLObjectType || parentType instanceof _definition.GraphQLInterfaceType) {
          fieldDef = parentType.getFields()[fieldName];
        }
        var responseName = selection.alias ? selection.alias.value : fieldName;
        if (!nodeAndDefs[responseName]) {
          nodeAndDefs[responseName] = [];
        }
        nodeAndDefs[responseName].push([parentType, selection, fieldDef]);
        break;
      case Kind.FRAGMENT_SPREAD:
        fragmentNames[selection.name.value] = true;
        break;
      case Kind.INLINE_FRAGMENT:
        var typeCondition = selection.typeCondition;
        var inlineFragmentType = typeCondition ? (0, _typeFromAST.typeFromAST)(context.getSchema(), typeCondition) : parentType;
        _collectFieldsAndFragmentNames(context, inlineFragmentType, selection.selectionSet, nodeAndDefs, fragmentNames);
        break;
    }
  }
}

// Given a series of Conflicts which occurred between two sub-fields, generate
// a single Conflict.
function subfieldConflicts(conflicts, responseName, node1, node2) {
  if (conflicts.length > 0) {
    return [[responseName, conflicts.map(function (_ref3) {
      var reason = _ref3[0];
      return reason;
    })], conflicts.reduce(function (allFields, _ref4) {
      var fields1 = _ref4[1];
      return allFields.concat(fields1);
    }, [node1]), conflicts.reduce(function (allFields, _ref5) {
      var fields2 = _ref5[2];
      return allFields.concat(fields2);
    }, [node2])];
  }
}

/**
 * A way to keep track of pairs of things when the ordering of the pair does
 * not matter. We do this by maintaining a sort of double adjacency sets.
 */

var PairSet = function () {
  function PairSet() {
    _classCallCheck(this, PairSet);

    this._data = Object.create(null);
  }

  PairSet.prototype.has = function has(a, b, areMutuallyExclusive) {
    var first = this._data[a];
    var result = first && first[b];
    if (result === undefined) {
      return false;
    }
    // areMutuallyExclusive being false is a superset of being true,
    // hence if we want to know if this PairSet "has" these two with no
    // exclusivity, we have to ensure it was added as such.
    if (areMutuallyExclusive === false) {
      return result === false;
    }
    return true;
  };

  PairSet.prototype.add = function add(a, b, areMutuallyExclusive) {
    _pairSetAdd(this._data, a, b, areMutuallyExclusive);
    _pairSetAdd(this._data, b, a, areMutuallyExclusive);
  };

  return PairSet;
}();

function _pairSetAdd(data, a, b, areMutuallyExclusive) {
  var map = data[a];
  if (!map) {
    map = Object.create(null);
    data[a] = map;
  }
  map[b] = areMutuallyExclusive;
}

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateInputFieldMessage = duplicateInputFieldMessage;
exports.UniqueInputFieldNames = UniqueInputFieldNames;

var _error = __webpack_require__(0);

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function duplicateInputFieldMessage(fieldName) {
  return 'There can be only one input field named "' + fieldName + '".';
}

/**
 * Unique input field names
 *
 * A GraphQL input object value is only valid if all supplied fields are
 * uniquely named.
 */
function UniqueInputFieldNames(context) {
  var knownNameStack = [];
  var knownNames = Object.create(null);

  return {
    ObjectValue: {
      enter: function enter() {
        knownNameStack.push(knownNames);
        knownNames = Object.create(null);
      },
      leave: function leave() {
        knownNames = knownNameStack.pop();
      }
    },
    ObjectField: function ObjectField(node) {
      var fieldName = node.name.value;
      if (knownNames[fieldName]) {
        context.reportError(new _error.GraphQLError(duplicateInputFieldMessage(fieldName), [knownNames[fieldName], node.name]));
      } else {
        knownNames[fieldName] = node.name;
      }
      return false;
    }
  };
}

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidJSValue = isValidJSValue;

var _iterall = __webpack_require__(19);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _isNullish = __webpack_require__(14);

var _isNullish2 = _interopRequireDefault(_isNullish);

var _definition = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Given a JavaScript value and a GraphQL type, determine if the value will be
 * accepted for that type. This is primarily useful for validating the
 * runtime values of query variables.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function isValidJSValue(value, type) {
  // A value must be provided if the type is non-null.
  if (type instanceof _definition.GraphQLNonNull) {
    if ((0, _isNullish2.default)(value)) {
      return ['Expected "' + String(type) + '", found null.'];
    }
    return isValidJSValue(value, type.ofType);
  }

  if ((0, _isNullish2.default)(value)) {
    return [];
  }

  // Lists accept a non-list value as a list of one.
  if (type instanceof _definition.GraphQLList) {
    var itemType = type.ofType;
    if ((0, _iterall.isCollection)(value)) {
      var errors = [];
      (0, _iterall.forEach)(value, function (item, index) {
        errors.push.apply(errors, isValidJSValue(item, itemType).map(function (error) {
          return 'In element #' + index + ': ' + error;
        }));
      });
      return errors;
    }
    return isValidJSValue(value, itemType);
  }

  // Input objects check each defined field.
  if (type instanceof _definition.GraphQLInputObjectType) {
    if (typeof value !== 'object' || value === null) {
      return ['Expected "' + type.name + '", found not an object.'];
    }
    var fields = type.getFields();

    var _errors = [];

    // Ensure every provided field is defined.
    Object.keys(value).forEach(function (providedField) {
      if (!fields[providedField]) {
        _errors.push('In field "' + providedField + '": Unknown field.');
      }
    });

    // Ensure every defined field is valid.
    Object.keys(fields).forEach(function (fieldName) {
      var newErrors = isValidJSValue(value[fieldName], fields[fieldName].type);
      _errors.push.apply(_errors, newErrors.map(function (error) {
        return 'In field "' + fieldName + '": ' + error;
      }));
    });

    return _errors;
  }

  (0, _invariant2.default)(type instanceof _definition.GraphQLScalarType || type instanceof _definition.GraphQLEnumType, 'Must be input type');

  // Scalar/Enum input checks to ensure the type can parse the value to
  // a non-null value.
  try {
    var parseResult = type.parseValue(value);
    if ((0, _isNullish2.default)(parseResult) && !type.isValidValue(value)) {
      return ['Expected type "' + type.name + '", found ' + JSON.stringify(value) + '.'];
    }
  } catch (error) {
    return ['Expected type "' + type.name + '", found ' + JSON.stringify(value) + ': ' + error.message];
  }

  return [];
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildASTSchema = buildASTSchema;
exports.getDeprecationReason = getDeprecationReason;
exports.getDescription = getDescription;
exports.buildSchema = buildSchema;

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _keyValMap = __webpack_require__(57);

var _keyValMap2 = _interopRequireDefault(_keyValMap);

var _valueFromAST = __webpack_require__(28);

var _lexer = __webpack_require__(49);

var _parser = __webpack_require__(34);

var _values = __webpack_require__(56);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

var _schema = __webpack_require__(9);

var _scalars = __webpack_require__(12);

var _definition = __webpack_require__(1);

var _directives = __webpack_require__(10);

var _introspection = __webpack_require__(15);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function buildWrappedType(innerType, inputTypeNode) {
  if (inputTypeNode.kind === Kind.LIST_TYPE) {
    return new _definition.GraphQLList(buildWrappedType(innerType, inputTypeNode.type));
  }
  if (inputTypeNode.kind === Kind.NON_NULL_TYPE) {
    var wrappedType = buildWrappedType(innerType, inputTypeNode.type);
    (0, _invariant2.default)(!(wrappedType instanceof _definition.GraphQLNonNull), 'No nesting nonnull.');
    return new _definition.GraphQLNonNull(wrappedType);
  }
  return innerType;
}

function getNamedTypeNode(typeNode) {
  var namedType = typeNode;
  while (namedType.kind === Kind.LIST_TYPE || namedType.kind === Kind.NON_NULL_TYPE) {
    namedType = namedType.type;
  }
  return namedType;
}

/**
 * This takes the ast of a schema document produced by the parse function in
 * src/language/parser.js.
 *
 * If no schema definition is provided, then it will look for types named Query
 * and Mutation.
 *
 * Given that AST it constructs a GraphQLSchema. The resulting schema
 * has no resolve methods, so execution will use default resolvers.
 */
function buildASTSchema(ast) {
  if (!ast || ast.kind !== Kind.DOCUMENT) {
    throw new Error('Must provide a document ast.');
  }

  var schemaDef = void 0;

  var typeDefs = [];
  var nodeMap = Object.create(null);
  var directiveDefs = [];
  for (var i = 0; i < ast.definitions.length; i++) {
    var d = ast.definitions[i];
    switch (d.kind) {
      case Kind.SCHEMA_DEFINITION:
        if (schemaDef) {
          throw new Error('Must provide only one schema definition.');
        }
        schemaDef = d;
        break;
      case Kind.SCALAR_TYPE_DEFINITION:
      case Kind.OBJECT_TYPE_DEFINITION:
      case Kind.INTERFACE_TYPE_DEFINITION:
      case Kind.ENUM_TYPE_DEFINITION:
      case Kind.UNION_TYPE_DEFINITION:
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        var typeName = d.name.value;
        if (nodeMap[typeName]) {
          throw new Error('Type "' + typeName + '" was defined more than once.');
        }
        typeDefs.push(d);
        nodeMap[typeName] = d;
        break;
      case Kind.DIRECTIVE_DEFINITION:
        directiveDefs.push(d);
        break;
    }
  }

  var queryTypeName = void 0;
  var mutationTypeName = void 0;
  var subscriptionTypeName = void 0;
  if (schemaDef) {
    schemaDef.operationTypes.forEach(function (operationType) {
      var typeName = operationType.type.name.value;
      if (operationType.operation === 'query') {
        if (queryTypeName) {
          throw new Error('Must provide only one query type in schema.');
        }
        if (!nodeMap[typeName]) {
          throw new Error('Specified query type "' + typeName + '" not found in document.');
        }
        queryTypeName = typeName;
      } else if (operationType.operation === 'mutation') {
        if (mutationTypeName) {
          throw new Error('Must provide only one mutation type in schema.');
        }
        if (!nodeMap[typeName]) {
          throw new Error('Specified mutation type "' + typeName + '" not found in document.');
        }
        mutationTypeName = typeName;
      } else if (operationType.operation === 'subscription') {
        if (subscriptionTypeName) {
          throw new Error('Must provide only one subscription type in schema.');
        }
        if (!nodeMap[typeName]) {
          throw new Error('Specified subscription type "' + typeName + '" not found in document.');
        }
        subscriptionTypeName = typeName;
      }
    });
  } else {
    if (nodeMap.Query) {
      queryTypeName = 'Query';
    }
    if (nodeMap.Mutation) {
      mutationTypeName = 'Mutation';
    }
    if (nodeMap.Subscription) {
      subscriptionTypeName = 'Subscription';
    }
  }

  if (!queryTypeName) {
    throw new Error('Must provide schema definition with query type or a type named Query.');
  }

  var innerTypeMap = {
    String: _scalars.GraphQLString,
    Int: _scalars.GraphQLInt,
    Float: _scalars.GraphQLFloat,
    Boolean: _scalars.GraphQLBoolean,
    ID: _scalars.GraphQLID,
    __Schema: _introspection.__Schema,
    __Directive: _introspection.__Directive,
    __DirectiveLocation: _introspection.__DirectiveLocation,
    __Type: _introspection.__Type,
    __Field: _introspection.__Field,
    __InputValue: _introspection.__InputValue,
    __EnumValue: _introspection.__EnumValue,
    __TypeKind: _introspection.__TypeKind
  };

  var types = typeDefs.map(function (def) {
    return typeDefNamed(def.name.value);
  });

  var directives = directiveDefs.map(getDirective);

  // If specified directives were not explicitly declared, add them.
  if (!directives.some(function (directive) {
    return directive.name === 'skip';
  })) {
    directives.push(_directives.GraphQLSkipDirective);
  }

  if (!directives.some(function (directive) {
    return directive.name === 'include';
  })) {
    directives.push(_directives.GraphQLIncludeDirective);
  }

  if (!directives.some(function (directive) {
    return directive.name === 'deprecated';
  })) {
    directives.push(_directives.GraphQLDeprecatedDirective);
  }

  return new _schema.GraphQLSchema({
    query: getObjectType(nodeMap[queryTypeName]),
    mutation: mutationTypeName ? getObjectType(nodeMap[mutationTypeName]) : null,
    subscription: subscriptionTypeName ? getObjectType(nodeMap[subscriptionTypeName]) : null,
    types: types,
    directives: directives
  });

  function getDirective(directiveNode) {
    return new _directives.GraphQLDirective({
      name: directiveNode.name.value,
      description: getDescription(directiveNode),
      locations: directiveNode.locations.map(function (node) {
        return node.value;
      }),
      args: directiveNode.arguments && makeInputValues(directiveNode.arguments)
    });
  }

  function getObjectType(typeNode) {
    var type = typeDefNamed(typeNode.name.value);
    (0, _invariant2.default)(type instanceof _definition.GraphQLObjectType, 'AST must provide object type.');
    return type;
  }

  function produceType(typeNode) {
    var typeName = getNamedTypeNode(typeNode).name.value;
    var typeDef = typeDefNamed(typeName);
    return buildWrappedType(typeDef, typeNode);
  }

  function produceInputType(typeNode) {
    return (0, _definition.assertInputType)(produceType(typeNode));
  }

  function produceOutputType(typeNode) {
    return (0, _definition.assertOutputType)(produceType(typeNode));
  }

  function produceObjectType(typeNode) {
    var type = produceType(typeNode);
    (0, _invariant2.default)(type instanceof _definition.GraphQLObjectType, 'Expected Object type.');
    return type;
  }

  function produceInterfaceType(typeNode) {
    var type = produceType(typeNode);
    (0, _invariant2.default)(type instanceof _definition.GraphQLInterfaceType, 'Expected Interface type.');
    return type;
  }

  function typeDefNamed(typeName) {
    if (innerTypeMap[typeName]) {
      return innerTypeMap[typeName];
    }

    if (!nodeMap[typeName]) {
      throw new Error('Type "' + typeName + '" not found in document.');
    }

    var innerTypeDef = makeSchemaDef(nodeMap[typeName]);
    if (!innerTypeDef) {
      throw new Error('Nothing constructed for "' + typeName + '".');
    }
    innerTypeMap[typeName] = innerTypeDef;
    return innerTypeDef;
  }

  function makeSchemaDef(def) {
    if (!def) {
      throw new Error('def must be defined');
    }
    switch (def.kind) {
      case Kind.OBJECT_TYPE_DEFINITION:
        return makeTypeDef(def);
      case Kind.INTERFACE_TYPE_DEFINITION:
        return makeInterfaceDef(def);
      case Kind.ENUM_TYPE_DEFINITION:
        return makeEnumDef(def);
      case Kind.UNION_TYPE_DEFINITION:
        return makeUnionDef(def);
      case Kind.SCALAR_TYPE_DEFINITION:
        return makeScalarDef(def);
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        return makeInputObjectDef(def);
      default:
        throw new Error('Type kind "' + def.kind + '" not supported.');
    }
  }

  function makeTypeDef(def) {
    var typeName = def.name.value;
    return new _definition.GraphQLObjectType({
      name: typeName,
      description: getDescription(def),
      fields: function fields() {
        return makeFieldDefMap(def);
      },
      interfaces: function interfaces() {
        return makeImplementedInterfaces(def);
      }
    });
  }

  function makeFieldDefMap(def) {
    return (0, _keyValMap2.default)(def.fields, function (field) {
      return field.name.value;
    }, function (field) {
      return {
        type: produceOutputType(field.type),
        description: getDescription(field),
        args: makeInputValues(field.arguments),
        deprecationReason: getDeprecationReason(field)
      };
    });
  }

  function makeImplementedInterfaces(def) {
    return def.interfaces && def.interfaces.map(function (iface) {
      return produceInterfaceType(iface);
    });
  }

  function makeInputValues(values) {
    return (0, _keyValMap2.default)(values, function (value) {
      return value.name.value;
    }, function (value) {
      var type = produceInputType(value.type);
      return {
        type: type,
        description: getDescription(value),
        defaultValue: (0, _valueFromAST.valueFromAST)(value.defaultValue, type)
      };
    });
  }

  function makeInterfaceDef(def) {
    var typeName = def.name.value;
    return new _definition.GraphQLInterfaceType({
      name: typeName,
      description: getDescription(def),
      fields: function fields() {
        return makeFieldDefMap(def);
      },
      resolveType: cannotExecuteSchema
    });
  }

  function makeEnumDef(def) {
    var enumType = new _definition.GraphQLEnumType({
      name: def.name.value,
      description: getDescription(def),
      values: (0, _keyValMap2.default)(def.values, function (enumValue) {
        return enumValue.name.value;
      }, function (enumValue) {
        return {
          description: getDescription(enumValue),
          deprecationReason: getDeprecationReason(enumValue)
        };
      })
    });

    return enumType;
  }

  function makeUnionDef(def) {
    return new _definition.GraphQLUnionType({
      name: def.name.value,
      description: getDescription(def),
      types: def.types.map(function (t) {
        return produceObjectType(t);
      }),
      resolveType: cannotExecuteSchema
    });
  }

  function makeScalarDef(def) {
    return new _definition.GraphQLScalarType({
      name: def.name.value,
      description: getDescription(def),
      serialize: function serialize() {
        return null;
      },
      // Note: validation calls the parse functions to determine if a
      // literal value is correct. Returning null would cause use of custom
      // scalars to always fail validation. Returning false causes them to
      // always pass validation.
      parseValue: function parseValue() {
        return false;
      },
      parseLiteral: function parseLiteral() {
        return false;
      }
    });
  }

  function makeInputObjectDef(def) {
    return new _definition.GraphQLInputObjectType({
      name: def.name.value,
      description: getDescription(def),
      fields: function fields() {
        return makeInputValues(def.fields);
      }
    });
  }
}

/**
 * Given a field or enum value node, returns the string value for the
 * deprecation reason.
 */
function getDeprecationReason(node) {
  var deprecated = (0, _values.getDirectiveValues)(_directives.GraphQLDeprecatedDirective, node);
  return deprecated && deprecated.reason;
}

/**
 * Given an ast node, returns its string description based on a contiguous
 * block full-line of comments preceding it.
 */
function getDescription(node) {
  var loc = node.loc;
  if (!loc) {
    return;
  }
  var comments = [];
  var minSpaces = void 0;
  var token = loc.startToken.prev;
  while (token && token.kind === _lexer.TokenKind.COMMENT && token.next && token.prev && token.line + 1 === token.next.line && token.line !== token.prev.line) {
    var value = String(token.value);
    var spaces = leadingSpaces(value);
    if (minSpaces === undefined || spaces < minSpaces) {
      minSpaces = spaces;
    }
    comments.push(value);
    token = token.prev;
  }
  return comments.reverse().map(function (comment) {
    return comment.slice(minSpaces);
  }).join('\n');
}

/**
 * A helper function to build a GraphQLSchema directly from a source
 * document.
 */
function buildSchema(source) {
  return buildASTSchema((0, _parser.parse)(source));
}

// Count the number of spaces on the starting side of a string.
function leadingSpaces(str) {
  var i = 0;
  for (; i < str.length; i++) {
    if (str[i] !== ' ') {
      break;
    }
  }
  return i;
}

function cannotExecuteSchema() {
  throw new Error('Generated Schema cannot use Interface or Union types for execution.');
}

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Mock"] = factory();
	else
		root["Mock"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global require, module, window */
	var Handler = __webpack_require__(1)
	var Util = __webpack_require__(3)
	var Random = __webpack_require__(5)
	var RE = __webpack_require__(20)
	var toJSONSchema = __webpack_require__(23)
	var valid = __webpack_require__(25)

	var XHR
	if (typeof window !== 'undefined') XHR = __webpack_require__(27)

	/*!
	    Mock - 模拟请求 & 模拟数据
	    https://github.com/nuysoft/Mock
	    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
	*/
	var Mock = {
	    Handler: Handler,
	    Random: Random,
	    Util: Util,
	    XHR: XHR,
	    RE: RE,
	    toJSONSchema: toJSONSchema,
	    valid: valid,
	    heredoc: Util.heredoc,
	    setup: function(settings) {
	        return XHR.setup(settings)
	    },
	    _mocked: {}
	}

	Mock.version = '1.0.1-beta3'

	// 避免循环依赖
	if (XHR) XHR.Mock = Mock

	/*
	    * Mock.mock( template )
	    * Mock.mock( function() )
	    * Mock.mock( rurl, template )
	    * Mock.mock( rurl, function(options) )
	    * Mock.mock( rurl, rtype, template )
	    * Mock.mock( rurl, rtype, function(options) )

	    根据数据模板生成模拟数据。
	*/
	Mock.mock = function(rurl, rtype, template) {
	    // Mock.mock(template)
	    if (arguments.length === 1) {
	        return Handler.gen(rurl)
	    }
	    // Mock.mock(rurl, template)
	    if (arguments.length === 2) {
	        template = rtype
	        rtype = undefined
	    }
	    // 拦截 XHR
	    if (XHR) window.XMLHttpRequest = XHR
	    Mock._mocked[rurl + (rtype || '')] = {
	        rurl: rurl,
	        rtype: rtype,
	        template: template
	    }
	    return Mock
	}

	module.exports = Mock

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* 
	    ## Handler

	    处理数据模板。
	    
	    * Handler.gen( template, name?, context? )

	        入口方法。

	    * Data Template Definition, DTD
	        
	        处理数据模板定义。

	        * Handler.array( options )
	        * Handler.object( options )
	        * Handler.number( options )
	        * Handler.boolean( options )
	        * Handler.string( options )
	        * Handler.function( options )
	        * Handler.regexp( options )
	        
	        处理路径（相对和绝对）。

	        * Handler.getValueByKeyPath( key, options )

	    * Data Placeholder Definition, DPD

	        处理数据占位符定义

	        * Handler.placeholder( placeholder, context, templateContext, options )

	*/

	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var Parser = __webpack_require__(4)
	var Random = __webpack_require__(5)
	var RE = __webpack_require__(20)

	var Handler = {
	    extend: Util.extend
	}

	/*
	    template        属性值（即数据模板）
	    name            属性名
	    context         数据上下文，生成后的数据
	    templateContext 模板上下文，

	    Handle.gen(template, name, options)
	    context
	        currentContext, templateCurrentContext, 
	        path, templatePath
	        root, templateRoot
	*/
	Handler.gen = function(template, name, context) {
	    /* jshint -W041 */
	    name = name == undefined ? '' : (name + '')

	    context = context || {}
	    context = {
	            // 当前访问路径，只有属性名，不包括生成规则
	            path: context.path || [Constant.GUID],
	            templatePath: context.templatePath || [Constant.GUID++],
	            // 最终属性值的上下文
	            currentContext: context.currentContext,
	            // 属性值模板的上下文
	            templateCurrentContext: context.templateCurrentContext || template,
	            // 最终值的根
	            root: context.root || context.currentContext,
	            // 模板的根
	            templateRoot: context.templateRoot || context.templateCurrentContext || template
	        }
	        // console.log('path:', context.path.join('.'), template)

	    var rule = Parser.parse(name)
	    var type = Util.type(template)
	    var data

	    if (Handler[type]) {
	        data = Handler[type]({
	            // 属性值类型
	            type: type,
	            // 属性值模板
	            template: template,
	            // 属性名 + 生成规则
	            name: name,
	            // 属性名
	            parsedName: name ? name.replace(Constant.RE_KEY, '$1') : name,

	            // 解析后的生成规则
	            rule: rule,
	            // 相关上下文
	            context: context
	        })

	        if (!context.root) context.root = data
	        return data
	    }

	    return template
	}

	Handler.extend({
	    array: function(options) {
	        var result = [],
	            i, ii;

	        // 'name|1': []
	        // 'name|count': []
	        // 'name|min-max': []
	        if (options.template.length === 0) return result

	        // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
	        if (!options.rule.parameters) {
	            for (i = 0; i < options.template.length; i++) {
	                options.context.path.push(i)
	                options.context.templatePath.push(i)
	                result.push(
	                    Handler.gen(options.template[i], i, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })
	                )
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            }
	        } else {
	            // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
	            if (options.rule.min === 1 && options.rule.max === undefined) {
	                // fix #17
	                options.context.path.push(options.name)
	                options.context.templatePath.push(options.name)
	                result = Random.pick(
	                    Handler.gen(options.template, undefined, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })
	                )
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            } else {
	                // 'data|+1': [{}, {}]
	                if (options.rule.parameters[2]) {
	                    options.template.__order_index = options.template.__order_index || 0

	                    options.context.path.push(options.name)
	                    options.context.templatePath.push(options.name)
	                    result = Handler.gen(options.template, undefined, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })[
	                        options.template.__order_index % options.template.length
	                    ]

	                    options.template.__order_index += +options.rule.parameters[2]

	                    options.context.path.pop()
	                    options.context.templatePath.pop()

	                } else {
	                    // 'data|1-10': [{}]
	                    for (i = 0; i < options.rule.count; i++) {
	                        // 'data|1-10': [{}, {}]
	                        for (ii = 0; ii < options.template.length; ii++) {
	                            options.context.path.push(result.length)
	                            options.context.templatePath.push(ii)
	                            result.push(
	                                Handler.gen(options.template[ii], result.length, {
	                                    path: options.context.path,
	                                    templatePath: options.context.templatePath,
	                                    currentContext: result,
	                                    templateCurrentContext: options.template,
	                                    root: options.context.root || result,
	                                    templateRoot: options.context.templateRoot || options.template
	                                })
	                            )
	                            options.context.path.pop()
	                            options.context.templatePath.pop()
	                        }
	                    }
	                }
	            }
	        }
	        return result
	    },
	    object: function(options) {
	        var result = {},
	            keys, fnKeys, key, parsedKey, inc, i;

	        // 'obj|min-max': {}
	        /* jshint -W041 */
	        if (options.rule.min != undefined) {
	            keys = Util.keys(options.template)
	            keys = Random.shuffle(keys)
	            keys = keys.slice(0, options.rule.count)
	            for (i = 0; i < keys.length; i++) {
	                key = keys[i]
	                parsedKey = key.replace(Constant.RE_KEY, '$1')
	                options.context.path.push(parsedKey)
	                options.context.templatePath.push(key)
	                result[parsedKey] = Handler.gen(options.template[key], key, {
	                    path: options.context.path,
	                    templatePath: options.context.templatePath,
	                    currentContext: result,
	                    templateCurrentContext: options.template,
	                    root: options.context.root || result,
	                    templateRoot: options.context.templateRoot || options.template
	                })
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            }

	        } else {
	            // 'obj': {}
	            keys = []
	            fnKeys = [] // #25 改变了非函数属性的顺序，查找起来不方便
	            for (key in options.template) {
	                (typeof options.template[key] === 'function' ? fnKeys : keys).push(key)
	            }
	            keys = keys.concat(fnKeys)

	            /*
	                会改变非函数属性的顺序
	                keys = Util.keys(options.template)
	                keys.sort(function(a, b) {
	                    var afn = typeof options.template[a] === 'function'
	                    var bfn = typeof options.template[b] === 'function'
	                    if (afn === bfn) return 0
	                    if (afn && !bfn) return 1
	                    if (!afn && bfn) return -1
	                })
	            */

	            for (i = 0; i < keys.length; i++) {
	                key = keys[i]
	                parsedKey = key.replace(Constant.RE_KEY, '$1')
	                options.context.path.push(parsedKey)
	                options.context.templatePath.push(key)
	                result[parsedKey] = Handler.gen(options.template[key], key, {
	                    path: options.context.path,
	                    templatePath: options.context.templatePath,
	                    currentContext: result,
	                    templateCurrentContext: options.template,
	                    root: options.context.root || result,
	                    templateRoot: options.context.templateRoot || options.template
	                })
	                options.context.path.pop()
	                options.context.templatePath.pop()
	                    // 'id|+1': 1
	                inc = key.match(Constant.RE_KEY)
	                if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
	                    options.template[key] += parseInt(inc[2], 10)
	                }
	            }
	        }
	        return result
	    },
	    number: function(options) {
	        var result, parts;
	        if (options.rule.decimal) { // float
	            options.template += ''
	            parts = options.template.split('.')
	                // 'float1|.1-10': 10,
	                // 'float2|1-100.1-10': 1,
	                // 'float3|999.1-10': 1,
	                // 'float4|.3-10': 123.123,
	            parts[0] = options.rule.range ? options.rule.count : parts[0]
	            parts[1] = (parts[1] || '').slice(0, options.rule.dcount)
	            while (parts[1].length < options.rule.dcount) {
	                parts[1] += (
	                    // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
	                    (parts[1].length < options.rule.dcount - 1) ? Random.character('number') : Random.character('123456789')
	                )
	            }
	            result = parseFloat(parts.join('.'), 10)
	        } else { // integer
	            // 'grade1|1-100': 1,
	            result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template
	        }
	        return result
	    },
	    boolean: function(options) {
	        var result;
	        // 'prop|multiple': false, 当前值是相反值的概率倍数
	        // 'prop|probability-probability': false, 当前值与相反值的概率
	        result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template
	        return result
	    },
	    string: function(options) {
	        var result = '',
	            i, placeholders, ph, phed;
	        if (options.template.length) {

	            //  'foo': '★',
	            /* jshint -W041 */
	            if (options.rule.count == undefined) {
	                result += options.template
	            }

	            // 'star|1-5': '★',
	            for (i = 0; i < options.rule.count; i++) {
	                result += options.template
	            }
	            // 'email|1-10': '@EMAIL, ',
	            placeholders = result.match(Constant.RE_PLACEHOLDER) || [] // A-Z_0-9 > \w_
	            for (i = 0; i < placeholders.length; i++) {
	                ph = placeholders[i]

	                // 遇到转义斜杠，不需要解析占位符
	                if (/^\\/.test(ph)) {
	                    placeholders.splice(i--, 1)
	                    continue
	                }

	                phed = Handler.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options)

	                // 只有一个占位符，并且没有其他字符
	                if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) { // 
	                    result = phed
	                    break

	                    if (Util.isNumeric(phed)) {
	                        result = parseFloat(phed, 10)
	                        break
	                    }
	                    if (/^(true|false)$/.test(phed)) {
	                        result = phed === 'true' ? true :
	                            phed === 'false' ? false :
	                            phed // 已经是布尔值
	                        break
	                    }
	                }
	                result = result.replace(ph, phed)
	            }

	        } else {
	            // 'ASCII|1-10': '',
	            // 'ASCII': '',
	            result = options.rule.range ? Random.string(options.rule.count) : options.template
	        }
	        return result
	    },
	    'function': function(options) {
	        // ( context, options )
	        return options.template.call(options.context.currentContext, options)
	    },
	    'regexp': function(options) {
	        var source = ''

	        // 'name': /regexp/,
	        /* jshint -W041 */
	        if (options.rule.count == undefined) {
	            source += options.template.source // regexp.source
	        }

	        // 'name|1-5': /regexp/,
	        for (var i = 0; i < options.rule.count; i++) {
	            source += options.template.source
	        }

	        return RE.Handler.gen(
	            RE.Parser.parse(
	                source
	            )
	        )
	    }
	})

	Handler.extend({
	    _all: function() {
	        var re = {};
	        for (var key in Random) re[key.toLowerCase()] = key
	        return re
	    },
	    // 处理占位符，转换为最终值
	    placeholder: function(placeholder, obj, templateContext, options) {
	        // console.log(options.context.path)
	        // 1 key, 2 params
	        Constant.RE_PLACEHOLDER.exec('')
	        var parts = Constant.RE_PLACEHOLDER.exec(placeholder),
	            key = parts && parts[1],
	            lkey = key && key.toLowerCase(),
	            okey = this._all()[lkey],
	            params = parts && parts[2] || ''
	        var pathParts = this.splitPathToArray(key)

	        // 解析占位符的参数
	        try {
	            // 1. 尝试保持参数的类型
	            /*
	                #24 [Window Firefox 30.0 引用 占位符 抛错](https://github.com/nuysoft/Mock/issues/24)
	                [BX9056: 各浏览器下 window.eval 方法的执行上下文存在差异](http://www.w3help.org/zh-cn/causes/BX9056)
	                应该属于 Window Firefox 30.0 的 BUG
	            */
	            /* jshint -W061 */
	            params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
	        } catch (error) {
	            // 2. 如果失败，只能解析为字符串
	            // console.error(error)
	            // if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
	            // else throw error
	            params = parts[2].split(/,\s*/)
	        }

	        // 占位符优先引用数据模板中的属性
	        if (obj && (key in obj)) return obj[key]

	        // @index @key
	        // if (Constant.RE_INDEX.test(key)) return +options.name
	        // if (Constant.RE_KEY.test(key)) return options.name

	        // 绝对路径 or 相对路径
	        if (
	            key.charAt(0) === '/' ||
	            pathParts.length > 1
	        ) return this.getValueByKeyPath(key, options)

	        // 递归引用数据模板中的属性
	        if (templateContext &&
	            (typeof templateContext === 'object') &&
	            (key in templateContext) &&
	            (placeholder !== templateContext[key]) // fix #15 避免自己依赖自己
	        ) {
	            // 先计算被引用的属性值
	            templateContext[key] = Handler.gen(templateContext[key], key, {
	                currentContext: obj,
	                templateCurrentContext: templateContext
	            })
	            return templateContext[key]
	        }

	        // 如果未找到，则原样返回
	        if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder

	        // 递归解析参数中的占位符
	        for (var i = 0; i < params.length; i++) {
	            Constant.RE_PLACEHOLDER.exec('')
	            if (Constant.RE_PLACEHOLDER.test(params[i])) {
	                params[i] = Handler.placeholder(params[i], obj, templateContext, options)
	            }
	        }

	        var handle = Random[key] || Random[lkey] || Random[okey]
	        switch (Util.type(handle)) {
	            case 'array':
	                // 自动从数组中取一个，例如 @areas
	                return Random.pick(handle)
	            case 'function':
	                // 执行占位符方法（大多数情况）
	                handle.options = options
	                var re = handle.apply(Random, params)
	                if (re === undefined) re = '' // 因为是在字符串中，所以默认为空字符串。
	                delete handle.options
	                return re
	        }
	    },
	    getValueByKeyPath: function(key, options) {
	        var originalKey = key
	        var keyPathParts = this.splitPathToArray(key)
	        var absolutePathParts = []

	        // 绝对路径
	        if (key.charAt(0) === '/') {
	            absolutePathParts = [options.context.path[0]].concat(
	                this.normalizePath(keyPathParts)
	            )
	        } else {
	            // 相对路径
	            if (keyPathParts.length > 1) {
	                absolutePathParts = options.context.path.slice(0)
	                absolutePathParts.pop()
	                absolutePathParts = this.normalizePath(
	                    absolutePathParts.concat(keyPathParts)
	                )

	            }
	        }

	        key = keyPathParts[keyPathParts.length - 1]
	        var currentContext = options.context.root
	        var templateCurrentContext = options.context.templateRoot
	        for (var i = 1; i < absolutePathParts.length - 1; i++) {
	            currentContext = currentContext[absolutePathParts[i]]
	            templateCurrentContext = templateCurrentContext[absolutePathParts[i]]
	        }
	        // 引用的值已经计算好
	        if (currentContext && (key in currentContext)) return currentContext[key]

	        // 尚未计算，递归引用数据模板中的属性
	        if (templateCurrentContext &&
	            (typeof templateCurrentContext === 'object') &&
	            (key in templateCurrentContext) &&
	            (originalKey !== templateCurrentContext[key]) // fix #15 避免自己依赖自己
	        ) {
	            // 先计算被引用的属性值
	            templateCurrentContext[key] = Handler.gen(templateCurrentContext[key], key, {
	                currentContext: currentContext,
	                templateCurrentContext: templateCurrentContext
	            })
	            return templateCurrentContext[key]
	        }
	    },
	    // https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
	    normalizePath: function(pathParts) {
	        var newPathParts = []
	        for (var i = 0; i < pathParts.length; i++) {
	            switch (pathParts[i]) {
	                case '..':
	                    newPathParts.pop()
	                    break
	                case '.':
	                    break
	                default:
	                    newPathParts.push(pathParts[i])
	            }
	        }
	        return newPathParts
	    },
	    splitPathToArray: function(path) {
	        var parts = path.split(/\/+/);
	        if (!parts[parts.length - 1]) parts = parts.slice(0, -1)
	        if (!parts[0]) parts = parts.slice(1)
	        return parts;
	    }
	})

	module.exports = Handler

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
	    ## Constant

	    常量集合。
	 */
	/*
	    RE_KEY
	        'name|min-max': value
	        'name|count': value
	        'name|min-max.dmin-dmax': value
	        'name|min-max.dcount': value
	        'name|count.dmin-dmax': value
	        'name|count.dcount': value
	        'name|+step': value

	        1 name, 2 step, 3 range [ min, max ], 4 drange [ dmin, dmax ]

	    RE_PLACEHOLDER
	        placeholder(*)

	    [正则查看工具](http://www.regexper.com/)

	    #26 生成规则 支持 负数，例如 number|-100-100
	*/
	module.exports = {
	    GUID: 1,
	    RE_KEY: /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/,
	    RE_RANGE: /([\+\-]?\d+)-?([\+\-]?\d+)?/,
	    RE_PLACEHOLDER: /\\*@([^@#%&()\?\s]+)(?:\((.*?)\))?/g
	    // /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g
	    // RE_INDEX: /^index$/,
	    // RE_KEY: /^key$/
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	    ## Utilities
	*/
	var Util = {}

	Util.extend = function extend() {
	    var target = arguments[0] || {},
	        i = 1,
	        length = arguments.length,
	        options, name, src, copy, clone

	    if (length === 1) {
	        target = this
	        i = 0
	    }

	    for (; i < length; i++) {
	        options = arguments[i]
	        if (!options) continue

	        for (name in options) {
	            src = target[name]
	            copy = options[name]

	            if (target === copy) continue
	            if (copy === undefined) continue

	            if (Util.isArray(copy) || Util.isObject(copy)) {
	                if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
	                if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}

	                target[name] = Util.extend(clone, copy)
	            } else {
	                target[name] = copy
	            }
	        }
	    }

	    return target
	}

	Util.each = function each(obj, iterator, context) {
	    var i, key
	    if (this.type(obj) === 'number') {
	        for (i = 0; i < obj; i++) {
	            iterator(i, i)
	        }
	    } else if (obj.length === +obj.length) {
	        for (i = 0; i < obj.length; i++) {
	            if (iterator.call(context, obj[i], i, obj) === false) break
	        }
	    } else {
	        for (key in obj) {
	            if (iterator.call(context, obj[key], key, obj) === false) break
	        }
	    }
	}

	Util.type = function type(obj) {
	    return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase()
	}

	Util.each('String Object Array RegExp Function'.split(' '), function(value) {
	    Util['is' + value] = function(obj) {
	        return Util.type(obj) === value.toLowerCase()
	    }
	})

	Util.isObjectOrArray = function(value) {
	    return Util.isObject(value) || Util.isArray(value)
	}

	Util.isNumeric = function(value) {
	    return !isNaN(parseFloat(value)) && isFinite(value)
	}

	Util.keys = function(obj) {
	    var keys = [];
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) keys.push(key)
	    }
	    return keys;
	}
	Util.values = function(obj) {
	    var values = [];
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) values.push(obj[key])
	    }
	    return values;
	}

	/*
	    ### Mock.heredoc(fn)

	    * Mock.heredoc(fn)

	    以直观、安全的方式书写（多行）HTML 模板。

	    **使用示例**如下所示：

	        var tpl = Mock.heredoc(function() {
	            /*!
	        {{email}}{{age}}
	        <!-- Mock { 
	            email: '@EMAIL',
	            age: '@INT(1,100)'
	        } -->
	            *\/
	        })
	    
	    **相关阅读**
	    * [Creating multiline strings in JavaScript](http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript)、
	*/
	Util.heredoc = function heredoc(fn) {
	    // 1. 移除起始的 function(){ /*!
	    // 2. 移除末尾的 */ }
	    // 3. 移除起始和末尾的空格
	    return fn.toString()
	        .replace(/^[^\/]+\/\*!?/, '')
	        .replace(/\*\/[^\/]+$/, '')
	        .replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '') // .trim()
	}

	Util.noop = function() {}

	module.exports = Util

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		## Parser

		解析数据模板（属性名部分）。

		* Parser.parse( name )
			
			```json
			{
				parameters: [ name, inc, range, decimal ],
				rnage: [ min , max ],

				min: min,
				max: max,
				count : count,

				decimal: decimal,
				dmin: dmin,
				dmax: dmax,
				dcount: dcount
			}
			```
	 */

	var Constant = __webpack_require__(2)
	var Random = __webpack_require__(5)

	/* jshint -W041 */
	module.exports = {
		parse: function(name) {
			name = name == undefined ? '' : (name + '')

			var parameters = (name || '').match(Constant.RE_KEY)

			var range = parameters && parameters[3] && parameters[3].match(Constant.RE_RANGE)
			var min = range && range[1] && parseInt(range[1], 10) // || 1
			var max = range && range[2] && parseInt(range[2], 10) // || 1
				// repeat || min-max || 1
				// var count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1
			var count = range ? !range[2] ? parseInt(range[1], 10) : Random.integer(min, max) : undefined

			var decimal = parameters && parameters[4] && parameters[4].match(Constant.RE_RANGE)
			var dmin = decimal && decimal[1] && parseInt(decimal[1], 10) // || 0,
			var dmax = decimal && decimal[2] && parseInt(decimal[2], 10) // || 0,
				// int || dmin-dmax || 0
			var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : undefined

			var result = {
				// 1 name, 2 inc, 3 range, 4 decimal
				parameters: parameters,
				// 1 min, 2 max
				range: range,
				min: min,
				max: max,
				// min-max
				count: count,
				// 是否有 decimal
				decimal: decimal,
				dmin: dmin,
				dmax: dmax,
				// dmin-dimax
				dcount: dcount
			}

			for (var r in result) {
				if (result[r] != undefined) return result
			}

			return {}
		}
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Mock.Random
	    
	    工具类，用于生成各种随机数据。
	*/

	var Util = __webpack_require__(3)

	var Random = {
	    extend: Util.extend
	}

	Random.extend(__webpack_require__(6))
	Random.extend(__webpack_require__(7))
	Random.extend(__webpack_require__(8))
	Random.extend(__webpack_require__(10))
	Random.extend(__webpack_require__(13))
	Random.extend(__webpack_require__(15))
	Random.extend(__webpack_require__(16))
	Random.extend(__webpack_require__(17))
	Random.extend(__webpack_require__(14))
	Random.extend(__webpack_require__(19))

	module.exports = Random

/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
	    ## Basics
	*/
	module.exports = {
	    // 返回一个随机的布尔值。
	    boolean: function(min, max, cur) {
	        if (cur !== undefined) {
	            min = typeof min !== 'undefined' && !isNaN(min) ? parseInt(min, 10) : 1
	            max = typeof max !== 'undefined' && !isNaN(max) ? parseInt(max, 10) : 1
	            return Math.random() > 1.0 / (min + max) * min ? !cur : cur
	        }

	        return Math.random() >= 0.5
	    },
	    bool: function(min, max, cur) {
	        return this.boolean(min, max, cur)
	    },
	    // 返回一个随机的自然数（大于等于 0 的整数）。
	    natural: function(min, max) {
	        min = typeof min !== 'undefined' ? parseInt(min, 10) : 0
	        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
	        return Math.round(Math.random() * (max - min)) + min
	    },
	    // 返回一个随机的整数。
	    integer: function(min, max) {
	        min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992
	        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
	        return Math.round(Math.random() * (max - min)) + min
	    },
	    int: function(min, max) {
	        return this.integer(min, max)
	    },
	    // 返回一个随机的浮点数。
	    float: function(min, max, dmin, dmax) {
	        dmin = dmin === undefined ? 0 : dmin
	        dmin = Math.max(Math.min(dmin, 17), 0)
	        dmax = dmax === undefined ? 17 : dmax
	        dmax = Math.max(Math.min(dmax, 17), 0)
	        var ret = this.integer(min, max) + '.';
	        for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
	            ret += (
	                // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
	                (i < dcount - 1) ? this.character('number') : this.character('123456789')
	            )
	        }
	        return parseFloat(ret, 10)
	    },
	    // 返回一个随机字符。
	    character: function(pool) {
	        var pools = {
	            lower: 'abcdefghijklmnopqrstuvwxyz',
	            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	            number: '0123456789',
	            symbol: '!@#$%^&*()[]'
	        }
	        pools.alpha = pools.lower + pools.upper
	        pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol

	        pool = pools[('' + pool).toLowerCase()] || pool
	        return pool.charAt(this.natural(0, pool.length - 1))
	    },
	    char: function(pool) {
	        return this.character(pool)
	    },
	    // 返回一个随机字符串。
	    string: function(pool, min, max) {
	        var len
	        switch (arguments.length) {
	            case 0: // ()
	                len = this.natural(3, 7)
	                break
	            case 1: // ( length )
	                len = pool
	                pool = undefined
	                break
	            case 2:
	                // ( pool, length )
	                if (typeof arguments[0] === 'string') {
	                    len = min
	                } else {
	                    // ( min, max )
	                    len = this.natural(pool, min)
	                    pool = undefined
	                }
	                break
	            case 3:
	                len = this.natural(min, max)
	                break
	        }

	        var text = ''
	        for (var i = 0; i < len; i++) {
	            text += this.character(pool)
	        }

	        return text
	    },
	    str: function( /*pool, min, max*/ ) {
	        return this.string.apply(this, arguments)
	    },
	    // 返回一个整型数组。
	    range: function(start, stop, step) {
	        // range( stop )
	        if (arguments.length <= 1) {
	            stop = start || 0;
	            start = 0;
	        }
	        // range( start, stop )
	        step = arguments[2] || 1;

	        start = +start
	        stop = +stop
	        step = +step

	        var len = Math.max(Math.ceil((stop - start) / step), 0);
	        var idx = 0;
	        var range = new Array(len);

	        while (idx < len) {
	            range[idx++] = start;
	            start += step;
	        }

	        return range;
	    }
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
	    ## Date
	*/
	var patternLetters = {
	    yyyy: 'getFullYear',
	    yy: function(date) {
	        return ('' + date.getFullYear()).slice(2)
	    },
	    y: 'yy',

	    MM: function(date) {
	        var m = date.getMonth() + 1
	        return m < 10 ? '0' + m : m
	    },
	    M: function(date) {
	        return date.getMonth() + 1
	    },

	    dd: function(date) {
	        var d = date.getDate()
	        return d < 10 ? '0' + d : d
	    },
	    d: 'getDate',

	    HH: function(date) {
	        var h = date.getHours()
	        return h < 10 ? '0' + h : h
	    },
	    H: 'getHours',
	    hh: function(date) {
	        var h = date.getHours() % 12
	        return h < 10 ? '0' + h : h
	    },
	    h: function(date) {
	        return date.getHours() % 12
	    },

	    mm: function(date) {
	        var m = date.getMinutes()
	        return m < 10 ? '0' + m : m
	    },
	    m: 'getMinutes',

	    ss: function(date) {
	        var s = date.getSeconds()
	        return s < 10 ? '0' + s : s
	    },
	    s: 'getSeconds',

	    SS: function(date) {
	        var ms = date.getMilliseconds()
	        return ms < 10 && '00' + ms || ms < 100 && '0' + ms || ms
	    },
	    S: 'getMilliseconds',

	    A: function(date) {
	        return date.getHours() < 12 ? 'AM' : 'PM'
	    },
	    a: function(date) {
	        return date.getHours() < 12 ? 'am' : 'pm'
	    },
	    T: 'getTime'
	}
	module.exports = {
	    // 日期占位符集合。
	    _patternLetters: patternLetters,
	    // 日期占位符正则。
	    _rformat: new RegExp((function() {
	        var re = []
	        for (var i in patternLetters) re.push(i)
	        return '(' + re.join('|') + ')'
	    })(), 'g'),
	    // 格式化日期。
	    _formatDate: function(date, format) {
	        return format.replace(this._rformat, function creatNewSubString($0, flag) {
	            return typeof patternLetters[flag] === 'function' ? patternLetters[flag](date) :
	                patternLetters[flag] in patternLetters ? creatNewSubString($0, patternLetters[flag]) :
	                date[patternLetters[flag]]()
	        })
	    },
	    // 生成一个随机的 Date 对象。
	    _randomDate: function(min, max) { // min, max
	        min = min === undefined ? new Date(0) : min
	        max = max === undefined ? new Date() : max
	        return new Date(Math.random() * (max.getTime() - min.getTime()))
	    },
	    // 返回一个随机的日期字符串。
	    date: function(format) {
	        format = format || 'yyyy-MM-dd'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // 返回一个随机的时间字符串。
	    time: function(format) {
	        format = format || 'HH:mm:ss'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // 返回一个随机的日期和时间字符串。
	    datetime: function(format) {
	        format = format || 'yyyy-MM-dd HH:mm:ss'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // 返回当前的日期和时间字符串。
	    now: function(unit, format) {
	        // now(unit) now(format)
	        if (arguments.length === 1) {
	            // now(format)
	            if (!/year|month|day|hour|minute|second|week/.test(unit)) {
	                format = unit
	                unit = ''
	            }
	        }
	        unit = (unit || '').toLowerCase()
	        format = format || 'yyyy-MM-dd HH:mm:ss'

	        var date = new Date()

	        /* jshint -W086 */
	        // 参考自 http://momentjs.cn/docs/#/manipulating/start-of/
	        switch (unit) {
	            case 'year':
	                date.setMonth(0)
	            case 'month':
	                date.setDate(1)
	            case 'week':
	            case 'day':
	                date.setHours(0)
	            case 'hour':
	                date.setMinutes(0)
	            case 'minute':
	                date.setSeconds(0)
	            case 'second':
	                date.setMilliseconds(0)
	        }
	        switch (unit) {
	            case 'week':
	                date.setDate(date.getDate() - date.getDay())
	        }

	        return this._formatDate(date, format)
	    }
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* global document  */
	/*
	    ## Image
	*/
	module.exports = {
	    // 常见的广告宽高
	    _adSize: [
	        '300x250', '250x250', '240x400', '336x280', '180x150',
	        '720x300', '468x60', '234x60', '88x31', '120x90',
	        '120x60', '120x240', '125x125', '728x90', '160x600',
	        '120x600', '300x600'
	    ],
	    // 常见的屏幕宽高
	    _screenSize: [
	        '320x200', '320x240', '640x480', '800x480', '800x480',
	        '1024x600', '1024x768', '1280x800', '1440x900', '1920x1200',
	        '2560x1600'
	    ],
	    // 常见的视频宽高
	    _videoSize: ['720x480', '768x576', '1280x720', '1920x1080'],
	    /*
	        生成一个随机的图片地址。

	        替代图片源
	            http://fpoimg.com/
	        参考自 
	            http://rensanning.iteye.com/blog/1933310
	            http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
	    */
	    image: function(size, background, foreground, format, text) {
	        // Random.image( size, background, foreground, text )
	        if (arguments.length === 4) {
	            text = format
	            format = undefined
	        }
	        // Random.image( size, background, text )
	        if (arguments.length === 3) {
	            text = foreground
	            foreground = undefined
	        }
	        // Random.image()
	        if (!size) size = this.pick(this._adSize)

	        if (background && ~background.indexOf('#')) background = background.slice(1)
	        if (foreground && ~foreground.indexOf('#')) foreground = foreground.slice(1)

	        // http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
	        return 'http://dummyimage.com/' + size +
	            (background ? '/' + background : '') +
	            (foreground ? '/' + foreground : '') +
	            (format ? '.' + format : '') +
	            (text ? '&text=' + text : '')
	    },
	    img: function() {
	        return this.image.apply(this, arguments)
	    },

	    /*
	        BrandColors
	        http://brandcolors.net/
	        A collection of major brand color codes curated by Galen Gidman.
	        大牌公司的颜色集合

	        // 获取品牌和颜色
	        $('h2').each(function(index, item){
	            item = $(item)
	            console.log('\'' + item.text() + '\'', ':', '\'' + item.next().text() + '\'', ',')
	        })
	    */
	    _brandColors: {
	        '4ormat': '#fb0a2a',
	        '500px': '#02adea',
	        'About.me (blue)': '#00405d',
	        'About.me (yellow)': '#ffcc33',
	        'Addvocate': '#ff6138',
	        'Adobe': '#ff0000',
	        'Aim': '#fcd20b',
	        'Amazon': '#e47911',
	        'Android': '#a4c639',
	        'Angie\'s List': '#7fbb00',
	        'AOL': '#0060a3',
	        'Atlassian': '#003366',
	        'Behance': '#053eff',
	        'Big Cartel': '#97b538',
	        'bitly': '#ee6123',
	        'Blogger': '#fc4f08',
	        'Boeing': '#0039a6',
	        'Booking.com': '#003580',
	        'Carbonmade': '#613854',
	        'Cheddar': '#ff7243',
	        'Code School': '#3d4944',
	        'Delicious': '#205cc0',
	        'Dell': '#3287c1',
	        'Designmoo': '#e54a4f',
	        'Deviantart': '#4e6252',
	        'Designer News': '#2d72da',
	        'Devour': '#fd0001',
	        'DEWALT': '#febd17',
	        'Disqus (blue)': '#59a3fc',
	        'Disqus (orange)': '#db7132',
	        'Dribbble': '#ea4c89',
	        'Dropbox': '#3d9ae8',
	        'Drupal': '#0c76ab',
	        'Dunked': '#2a323a',
	        'eBay': '#89c507',
	        'Ember': '#f05e1b',
	        'Engadget': '#00bdf6',
	        'Envato': '#528036',
	        'Etsy': '#eb6d20',
	        'Evernote': '#5ba525',
	        'Fab.com': '#dd0017',
	        'Facebook': '#3b5998',
	        'Firefox': '#e66000',
	        'Flickr (blue)': '#0063dc',
	        'Flickr (pink)': '#ff0084',
	        'Forrst': '#5b9a68',
	        'Foursquare': '#25a0ca',
	        'Garmin': '#007cc3',
	        'GetGlue': '#2d75a2',
	        'Gimmebar': '#f70078',
	        'GitHub': '#171515',
	        'Google Blue': '#0140ca',
	        'Google Green': '#16a61e',
	        'Google Red': '#dd1812',
	        'Google Yellow': '#fcca03',
	        'Google+': '#dd4b39',
	        'Grooveshark': '#f77f00',
	        'Groupon': '#82b548',
	        'Hacker News': '#ff6600',
	        'HelloWallet': '#0085ca',
	        'Heroku (light)': '#c7c5e6',
	        'Heroku (dark)': '#6567a5',
	        'HootSuite': '#003366',
	        'Houzz': '#73ba37',
	        'HTML5': '#ec6231',
	        'IKEA': '#ffcc33',
	        'IMDb': '#f3ce13',
	        'Instagram': '#3f729b',
	        'Intel': '#0071c5',
	        'Intuit': '#365ebf',
	        'Kickstarter': '#76cc1e',
	        'kippt': '#e03500',
	        'Kodery': '#00af81',
	        'LastFM': '#c3000d',
	        'LinkedIn': '#0e76a8',
	        'Livestream': '#cf0005',
	        'Lumo': '#576396',
	        'Mixpanel': '#a086d3',
	        'Meetup': '#e51937',
	        'Nokia': '#183693',
	        'NVIDIA': '#76b900',
	        'Opera': '#cc0f16',
	        'Path': '#e41f11',
	        'PayPal (dark)': '#1e477a',
	        'PayPal (light)': '#3b7bbf',
	        'Pinboard': '#0000e6',
	        'Pinterest': '#c8232c',
	        'PlayStation': '#665cbe',
	        'Pocket': '#ee4056',
	        'Prezi': '#318bff',
	        'Pusha': '#0f71b4',
	        'Quora': '#a82400',
	        'QUOTE.fm': '#66ceff',
	        'Rdio': '#008fd5',
	        'Readability': '#9c0000',
	        'Red Hat': '#cc0000',
	        'Resource': '#7eb400',
	        'Rockpack': '#0ba6ab',
	        'Roon': '#62b0d9',
	        'RSS': '#ee802f',
	        'Salesforce': '#1798c1',
	        'Samsung': '#0c4da2',
	        'Shopify': '#96bf48',
	        'Skype': '#00aff0',
	        'Snagajob': '#f47a20',
	        'Softonic': '#008ace',
	        'SoundCloud': '#ff7700',
	        'Space Box': '#f86960',
	        'Spotify': '#81b71a',
	        'Sprint': '#fee100',
	        'Squarespace': '#121212',
	        'StackOverflow': '#ef8236',
	        'Staples': '#cc0000',
	        'Status Chart': '#d7584f',
	        'Stripe': '#008cdd',
	        'StudyBlue': '#00afe1',
	        'StumbleUpon': '#f74425',
	        'T-Mobile': '#ea0a8e',
	        'Technorati': '#40a800',
	        'The Next Web': '#ef4423',
	        'Treehouse': '#5cb868',
	        'Trulia': '#5eab1f',
	        'Tumblr': '#34526f',
	        'Twitch.tv': '#6441a5',
	        'Twitter': '#00acee',
	        'TYPO3': '#ff8700',
	        'Ubuntu': '#dd4814',
	        'Ustream': '#3388ff',
	        'Verizon': '#ef1d1d',
	        'Vimeo': '#86c9ef',
	        'Vine': '#00a478',
	        'Virb': '#06afd8',
	        'Virgin Media': '#cc0000',
	        'Wooga': '#5b009c',
	        'WordPress (blue)': '#21759b',
	        'WordPress (orange)': '#d54e21',
	        'WordPress (grey)': '#464646',
	        'Wunderlist': '#2b88d9',
	        'XBOX': '#9bc848',
	        'XING': '#126567',
	        'Yahoo!': '#720e9e',
	        'Yandex': '#ffcc00',
	        'Yelp': '#c41200',
	        'YouTube': '#c4302b',
	        'Zalongo': '#5498dc',
	        'Zendesk': '#78a300',
	        'Zerply': '#9dcc7a',
	        'Zootool': '#5e8b1d'
	    },
	    _brandNames: function() {
	        var brands = [];
	        for (var b in this._brandColors) {
	            brands.push(b)
	        }
	        return brands
	    },
	    /*
	        生成一段随机的 Base64 图片编码。

	        https://github.com/imsky/holder
	        Holder renders image placeholders entirely on the client side.

	        dataImageHolder: function(size) {
	            return 'holder.js/' + size
	        },
	    */
	    dataImage: function(size, text) {
	        var canvas
	        if (typeof document !== 'undefined') {
	            canvas = document.createElement('canvas')
	        } else {
	            /*
	                https://github.com/Automattic/node-canvas
	                    npm install canvas --save
	                安装问题：
	                * http://stackoverflow.com/questions/22953206/gulp-issues-with-cario-install-command-not-found-when-trying-to-installing-canva
	                * https://github.com/Automattic/node-canvas/issues/415
	                * https://github.com/Automattic/node-canvas/wiki/_pages

	                PS：node-canvas 的安装过程实在是太繁琐了，所以不放入 package.json 的 dependencies。
	             */
	            var Canvas = module.require('canvas')
	            canvas = new Canvas()
	        }

	        var ctx = canvas && canvas.getContext && canvas.getContext("2d")
	        if (!canvas || !ctx) return ''

	        if (!size) size = this.pick(this._adSize)
	        text = text !== undefined ? text : size

	        size = size.split('x')

	        var width = parseInt(size[0], 10),
	            height = parseInt(size[1], 10),
	            background = this._brandColors[this.pick(this._brandNames())],
	            foreground = '#FFF',
	            text_height = 14,
	            font = 'sans-serif';

	        canvas.width = width
	        canvas.height = height
	        ctx.textAlign = 'center'
	        ctx.textBaseline = 'middle'
	        ctx.fillStyle = background
	        ctx.fillRect(0, 0, width, height)
	        ctx.fillStyle = foreground
	        ctx.font = 'bold ' + text_height + 'px ' + font
	        ctx.fillText(text, (width / 2), (height / 2), width)
	        return canvas.toDataURL('image/png')
	    }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)(module)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Color

	    http://llllll.li/randomColor/
	        A color generator for JavaScript.
	        randomColor generates attractive colors by default. More specifically, randomColor produces bright colors with a reasonably high saturation. This makes randomColor particularly useful for data visualizations and generative art.

	    http://randomcolour.com/
	        var bg_colour = Math.floor(Math.random() * 16777215).toString(16);
	        bg_colour = "#" + ("000000" + bg_colour).slice(-6);
	        document.bgColor = bg_colour;
	    
	    http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	        Creating random colors is actually more difficult than it seems. The randomness itself is easy, but aesthetically pleasing randomness is more difficult.
	        https://github.com/devongovett/color-generator

	    http://www.paulirish.com/2009/random-hex-color-code-snippets/
	        Random Hex Color Code Generator in JavaScript

	    http://chancejs.com/#color
	        chance.color()
	        // => '#79c157'
	        chance.color({format: 'hex'})
	        // => '#d67118'
	        chance.color({format: 'shorthex'})
	        // => '#60f'
	        chance.color({format: 'rgb'})
	        // => 'rgb(110,52,164)'

	    http://tool.c7sky.com/webcolor
	        网页设计常用色彩搭配表
	    
	    https://github.com/One-com/one-color
	        An OO-based JavaScript color parser/computation toolkit with support for RGB, HSV, HSL, CMYK, and alpha channels.
	        API 很赞

	    https://github.com/harthur/color
	        JavaScript color conversion and manipulation library

	    https://github.com/leaverou/css-colors
	        Share & convert CSS colors
	    http://leaverou.github.io/css-colors/#slategray
	        Type a CSS color keyword, #hex, hsl(), rgba(), whatever:

	    色调 hue
	        http://baike.baidu.com/view/23368.htm
	        色调指的是一幅画中画面色彩的总体倾向，是大的色彩效果。
	    饱和度 saturation
	        http://baike.baidu.com/view/189644.htm
	        饱和度是指色彩的鲜艳程度，也称色彩的纯度。饱和度取决于该色中含色成分和消色成分（灰色）的比例。含色成分越大，饱和度越大；消色成分越大，饱和度越小。
	    亮度 brightness
	        http://baike.baidu.com/view/34773.htm
	        亮度是指发光体（反光体）表面发光（反光）强弱的物理量。
	    照度 luminosity
	        物体被照亮的程度,采用单位面积所接受的光通量来表示,表示单位为勒[克斯](Lux,lx) ,即 1m / m2 。

	    http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
	        var letters = '0123456789ABCDEF'.split('')
	        var color = '#'
	        for (var i = 0; i < 6; i++) {
	            color += letters[Math.floor(Math.random() * 16)]
	        }
	        return color
	    
	        // 随机生成一个无脑的颜色，格式为 '#RRGGBB'。
	        // _brainlessColor()
	        var color = Math.floor(
	            Math.random() *
	            (16 * 16 * 16 * 16 * 16 * 16 - 1)
	        ).toString(16)
	        color = "#" + ("000000" + color).slice(-6)
	        return color.toUpperCase()
	*/

	var Convert = __webpack_require__(11)
	var DICT = __webpack_require__(12)

	module.exports = {
	    // 随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
	    color: function(name) {
	        if (name || DICT[name]) return DICT[name].nicer
	        return this.hex()
	    },
	    // #DAC0DE
	    hex: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        var hex = Convert.rgb2hex(rgb[0], rgb[1], rgb[2])
	        return hex
	    },
	    // rgb(128,255,255)
	    rgb: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        return 'rgb(' +
	            parseInt(rgb[0], 10) + ', ' +
	            parseInt(rgb[1], 10) + ', ' +
	            parseInt(rgb[2], 10) + ')'
	    },
	    // rgba(128,255,255,0.3)
	    rgba: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        return 'rgba(' +
	            parseInt(rgb[0], 10) + ', ' +
	            parseInt(rgb[1], 10) + ', ' +
	            parseInt(rgb[2], 10) + ', ' +
	            Math.random().toFixed(2) + ')'
	    },
	    // hsl(300,80%,90%)
	    hsl: function() {
	        var hsv = this._goldenRatioColor()
	        var hsl = Convert.hsv2hsl(hsv)
	        return 'hsl(' +
	            parseInt(hsl[0], 10) + ', ' +
	            parseInt(hsl[1], 10) + ', ' +
	            parseInt(hsl[2], 10) + ')'
	    },
	    // http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	    // https://github.com/devongovett/color-generator/blob/master/index.js
	    // 随机生成一个有吸引力的颜色。
	    _goldenRatioColor: function(saturation, value) {
	        this._goldenRatio = 0.618033988749895
	        this._hue = this._hue || Math.random()
	        this._hue += this._goldenRatio
	        this._hue %= 1

	        if (typeof saturation !== "number") saturation = 0.5;
	        if (typeof value !== "number") value = 0.95;

	        return [
	            this._hue * 360,
	            saturation * 100,
	            value * 100
	        ]
	    }
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	/*
	    ## Color Convert

	    http://blog.csdn.net/idfaya/article/details/6770414
	        颜色空间RGB与HSV(HSL)的转换
	*/
	// https://github.com/harthur/color-convert/blob/master/conversions.js
	module.exports = {
		rgb2hsl: function rgb2hsl(rgb) {
			var r = rgb[0] / 255,
				g = rgb[1] / 255,
				b = rgb[2] / 255,
				min = Math.min(r, g, b),
				max = Math.max(r, g, b),
				delta = max - min,
				h, s, l;

			if (max == min)
				h = 0;
			else if (r == max)
				h = (g - b) / delta;
			else if (g == max)
				h = 2 + (b - r) / delta;
			else if (b == max)
				h = 4 + (r - g) / delta;

			h = Math.min(h * 60, 360);

			if (h < 0)
				h += 360;

			l = (min + max) / 2;

			if (max == min)
				s = 0;
			else if (l <= 0.5)
				s = delta / (max + min);
			else
				s = delta / (2 - max - min);

			return [h, s * 100, l * 100];
		},
		rgb2hsv: function rgb2hsv(rgb) {
			var r = rgb[0],
				g = rgb[1],
				b = rgb[2],
				min = Math.min(r, g, b),
				max = Math.max(r, g, b),
				delta = max - min,
				h, s, v;

			if (max === 0)
				s = 0;
			else
				s = (delta / max * 1000) / 10;

			if (max == min)
				h = 0;
			else if (r == max)
				h = (g - b) / delta;
			else if (g == max)
				h = 2 + (b - r) / delta;
			else if (b == max)
				h = 4 + (r - g) / delta;

			h = Math.min(h * 60, 360);

			if (h < 0)
				h += 360;

			v = ((max / 255) * 1000) / 10;

			return [h, s, v];
		},
		hsl2rgb: function hsl2rgb(hsl) {
			var h = hsl[0] / 360,
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				t1, t2, t3, rgb, val;

			if (s === 0) {
				val = l * 255;
				return [val, val, val];
			}

			if (l < 0.5)
				t2 = l * (1 + s);
			else
				t2 = l + s - l * s;
			t1 = 2 * l - t2;

			rgb = [0, 0, 0];
			for (var i = 0; i < 3; i++) {
				t3 = h + 1 / 3 * -(i - 1);
				if (t3 < 0) t3++;
				if (t3 > 1) t3--;

				if (6 * t3 < 1)
					val = t1 + (t2 - t1) * 6 * t3;
				else if (2 * t3 < 1)
					val = t2;
				else if (3 * t3 < 2)
					val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
				else
					val = t1;

				rgb[i] = val * 255;
			}

			return rgb;
		},
		hsl2hsv: function hsl2hsv(hsl) {
			var h = hsl[0],
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				sv, v;
			l *= 2;
			s *= (l <= 1) ? l : 2 - l;
			v = (l + s) / 2;
			sv = (2 * s) / (l + s);
			return [h, sv * 100, v * 100];
		},
		hsv2rgb: function hsv2rgb(hsv) {
			var h = hsv[0] / 60
			var s = hsv[1] / 100
			var v = hsv[2] / 100
			var hi = Math.floor(h) % 6

			var f = h - Math.floor(h)
			var p = 255 * v * (1 - s)
			var q = 255 * v * (1 - (s * f))
			var t = 255 * v * (1 - (s * (1 - f)))

			v = 255 * v

			switch (hi) {
				case 0:
					return [v, t, p]
				case 1:
					return [q, v, p]
				case 2:
					return [p, v, t]
				case 3:
					return [p, q, v]
				case 4:
					return [t, p, v]
				case 5:
					return [v, p, q]
			}
		},
		hsv2hsl: function hsv2hsl(hsv) {
			var h = hsv[0],
				s = hsv[1] / 100,
				v = hsv[2] / 100,
				sl, l;

			l = (2 - s) * v;
			sl = s * v;
			sl /= (l <= 1) ? l : 2 - l;
			l /= 2;
			return [h, sl * 100, l * 100];
		},
		// http://www.140byt.es/keywords/color
		rgb2hex: function(
			a, // red, as a number from 0 to 255
			b, // green, as a number from 0 to 255
			c // blue, as a number from 0 to 255
		) {
			return "#" + ((256 + a << 8 | b) << 8 | c).toString(16).slice(1)
		},
		hex2rgb: function(
			a // take a "#xxxxxx" hex string,
		) {
			a = '0x' + a.slice(1).replace(a.length > 4 ? a : /./g, '$&$&') | 0;
			return [a >> 16, a >> 8 & 255, a & 255]
		}
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	/*
	    ## Color 字典数据

	    字典数据来源 [A nicer color palette for the web](http://clrs.cc/)
	*/
	module.exports = {
	    // name value nicer
	    navy: {
	        value: '#000080',
	        nicer: '#001F3F'
	    },
	    blue: {
	        value: '#0000ff',
	        nicer: '#0074D9'
	    },
	    aqua: {
	        value: '#00ffff',
	        nicer: '#7FDBFF'
	    },
	    teal: {
	        value: '#008080',
	        nicer: '#39CCCC'
	    },
	    olive: {
	        value: '#008000',
	        nicer: '#3D9970'
	    },
	    green: {
	        value: '#008000',
	        nicer: '#2ECC40'
	    },
	    lime: {
	        value: '#00ff00',
	        nicer: '#01FF70'
	    },
	    yellow: {
	        value: '#ffff00',
	        nicer: '#FFDC00'
	    },
	    orange: {
	        value: '#ffa500',
	        nicer: '#FF851B'
	    },
	    red: {
	        value: '#ff0000',
	        nicer: '#FF4136'
	    },
	    maroon: {
	        value: '#800000',
	        nicer: '#85144B'
	    },
	    fuchsia: {
	        value: '#ff00ff',
	        nicer: '#F012BE'
	    },
	    purple: {
	        value: '#800080',
	        nicer: '#B10DC9'
	    },
	    silver: {
	        value: '#c0c0c0',
	        nicer: '#DDDDDD'
	    },
	    gray: {
	        value: '#808080',
	        nicer: '#AAAAAA'
	    },
	    black: {
	        value: '#000000',
	        nicer: '#111111'
	    },
	    white: {
	        value: '#FFFFFF',
	        nicer: '#FFFFFF'
	    }
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Text

	    http://www.lipsum.com/
	*/
	var Basic = __webpack_require__(6)
	var Helper = __webpack_require__(14)

	function range(defaultMin, defaultMax, min, max) {
	    return min === undefined ? Basic.natural(defaultMin, defaultMax) : // ()
	        max === undefined ? min : // ( len )
	        Basic.natural(parseInt(min, 10), parseInt(max, 10)) // ( min, max )
	}

	module.exports = {
	    // 随机生成一段文本。
	    paragraph: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.sentence())
	        }
	        return result.join(' ')
	    },
	    // 
	    cparagraph: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.csentence())
	        }
	        return result.join('')
	    },
	    // 随机生成一个句子，第一个单词的首字母大写。
	    sentence: function(min, max) {
	        var len = range(12, 18, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.word())
	        }
	        return Helper.capitalize(result.join(' ')) + '.'
	    },
	    // 随机生成一个中文句子。
	    csentence: function(min, max) {
	        var len = range(12, 18, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.cword())
	        }

	        return result.join('') + '。'
	    },
	    // 随机生成一个单词。
	    word: function(min, max) {
	        var len = range(3, 10, min, max)
	        var result = '';
	        for (var i = 0; i < len; i++) {
	            result += Basic.character('lower')
	        }
	        return result
	    },
	    // 随机生成一个或多个汉字。
	    cword: function(pool, min, max) {
	        // 最常用的 500 个汉字 http://baike.baidu.com/view/568436.htm
	        var DICT_KANZI = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞'

	        var len
	        switch (arguments.length) {
	            case 0: // ()
	                pool = DICT_KANZI
	                len = 1
	                break
	            case 1: // ( pool )
	                if (typeof arguments[0] === 'string') {
	                    len = 1
	                } else {
	                    // ( length )
	                    len = pool
	                    pool = DICT_KANZI
	                }
	                break
	            case 2:
	                // ( pool, length )
	                if (typeof arguments[0] === 'string') {
	                    len = min
	                } else {
	                    // ( min, max )
	                    len = this.natural(pool, min)
	                    pool = DICT_KANZI
	                }
	                break
	            case 3:
	                len = this.natural(min, max)
	                break
	        }

	        var result = ''
	        for (var i = 0; i < len; i++) {
	            result += pool.charAt(this.natural(0, pool.length - 1))
	        }
	        return result
	    },
	    // 随机生成一句标题，其中每个单词的首字母大写。
	    title: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.capitalize(this.word()))
	        }
	        return result.join(' ')
	    },
	    // 随机生成一句中文标题。
	    ctitle: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.cword())
	        }
	        return result.join('')
	    }
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Helpers
	*/

	var Util = __webpack_require__(3)

	module.exports = {
		// 把字符串的第一个字母转换为大写。
		capitalize: function(word) {
			return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
		},
		// 把字符串转换为大写。
		upper: function(str) {
			return (str + '').toUpperCase()
		},
		// 把字符串转换为小写。
		lower: function(str) {
			return (str + '').toLowerCase()
		},
		// 从数组中随机选取一个元素，并返回。
		pick: function pick(arr, min, max) {
			// pick( item1, item2 ... )
			if (!Util.isArray(arr)) {
				arr = [].slice.call(arguments)
				min = 1
				max = 1
			} else {
				// pick( [ item1, item2 ... ] )
				if (min === undefined) min = 1

				// pick( [ item1, item2 ... ], count )
				if (max === undefined) max = min
			}

			if (min === 1 && max === 1) return arr[this.natural(0, arr.length - 1)]

			// pick( [ item1, item2 ... ], min, max )
			return this.shuffle(arr, min, max)

			// 通过参数个数判断方法签名，扩展性太差！#90
			// switch (arguments.length) {
			// 	case 1:
			// 		// pick( [ item1, item2 ... ] )
			// 		return arr[this.natural(0, arr.length - 1)]
			// 	case 2:
			// 		// pick( [ item1, item2 ... ], count )
			// 		max = min
			// 			/* falls through */
			// 	case 3:
			// 		// pick( [ item1, item2 ... ], min, max )
			// 		return this.shuffle(arr, min, max)
			// }
		},
		/*
		    打乱数组中元素的顺序，并返回。
		    Given an array, scramble the order and return it.

		    其他的实现思路：
		        // https://code.google.com/p/jslibs/wiki/JavascriptTips
		        result = result.sort(function() {
		            return Math.random() - 0.5
		        })
		*/
		shuffle: function shuffle(arr, min, max) {
			arr = arr || []
			var old = arr.slice(0),
				result = [],
				index = 0,
				length = old.length;
			for (var i = 0; i < length; i++) {
				index = this.natural(0, old.length - 1)
				result.push(old[index])
				old.splice(index, 1)
			}
			switch (arguments.length) {
				case 0:
				case 1:
					return result
				case 2:
					max = min
						/* falls through */
				case 3:
					min = parseInt(min, 10)
					max = parseInt(max, 10)
					return result.slice(0, this.natural(min, max))
			}
		},
		/*
		    * Random.order(item, item)
		    * Random.order([item, item ...])

		    顺序获取数组中的元素

		    [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)

		    不支持单独调用！
		*/
		order: function order(array) {
			order.cache = order.cache || {}

			if (arguments.length > 1) array = [].slice.call(arguments, 0)

			// options.context.path/templatePath
			var options = order.options
			var templatePath = options.context.templatePath.join('.')

			var cache = (
				order.cache[templatePath] = order.cache[templatePath] || {
					index: 0,
					array: array
				}
			)

			return cache.array[cache.index++ % cache.array.length]
		}
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	/*
	    ## Name

	    [Beyond the Top 1000 Names](http://www.ssa.gov/oact/babynames/limits.html)
	*/
	module.exports = {
		// 随机生成一个常见的英文名。
		first: function() {
			var names = [
				// male
				"James", "John", "Robert", "Michael", "William",
				"David", "Richard", "Charles", "Joseph", "Thomas",
				"Christopher", "Daniel", "Paul", "Mark", "Donald",
				"George", "Kenneth", "Steven", "Edward", "Brian",
				"Ronald", "Anthony", "Kevin", "Jason", "Matthew",
				"Gary", "Timothy", "Jose", "Larry", "Jeffrey",
				"Frank", "Scott", "Eric"
			].concat([
				// female
				"Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
				"Jennifer", "Maria", "Susan", "Margaret", "Dorothy",
				"Lisa", "Nancy", "Karen", "Betty", "Helen",
				"Sandra", "Donna", "Carol", "Ruth", "Sharon",
				"Michelle", "Laura", "Sarah", "Kimberly", "Deborah",
				"Jessica", "Shirley", "Cynthia", "Angela", "Melissa",
				"Brenda", "Amy", "Anna"
			])
			return this.pick(names)
				// or this.capitalize(this.word())
		},
		// 随机生成一个常见的英文姓。
		last: function() {
			var names = [
				"Smith", "Johnson", "Williams", "Brown", "Jones",
				"Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
				"Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
				"Moore", "Martin", "Jackson", "Thompson", "White",
				"Lopez", "Lee", "Gonzalez", "Harris", "Clark",
				"Lewis", "Robinson", "Walker", "Perez", "Hall",
				"Young", "Allen"
			]
			return this.pick(names)
				// or this.capitalize(this.word())
		},
		// 随机生成一个常见的英文姓名。
		name: function(middle) {
			return this.first() + ' ' +
				(middle ? this.first() + ' ' : '') +
				this.last()
		},
		/*
		    随机生成一个常见的中文姓。
		    [世界常用姓氏排行](http://baike.baidu.com/view/1719115.htm)
		    [玄派网 - 网络小说创作辅助平台](http://xuanpai.sinaapp.com/)
		 */
		cfirst: function() {
			var names = (
				'王 李 张 刘 陈 杨 赵 黄 周 吴 ' +
				'徐 孙 胡 朱 高 林 何 郭 马 罗 ' +
				'梁 宋 郑 谢 韩 唐 冯 于 董 萧 ' +
				'程 曹 袁 邓 许 傅 沈 曾 彭 吕 ' +
				'苏 卢 蒋 蔡 贾 丁 魏 薛 叶 阎 ' +
				'余 潘 杜 戴 夏 锺 汪 田 任 姜 ' +
				'范 方 石 姚 谭 廖 邹 熊 金 陆 ' +
				'郝 孔 白 崔 康 毛 邱 秦 江 史 ' +
				'顾 侯 邵 孟 龙 万 段 雷 钱 汤 ' +
				'尹 黎 易 常 武 乔 贺 赖 龚 文'
			).split(' ')
			return this.pick(names)
		},
		/*
		    随机生成一个常见的中文名。
		    [中国最常见名字前50名_三九算命网](http://www.name999.net/xingming/xingshi/20131004/48.html)
		 */
		clast: function() {
			var names = (
				'伟 芳 娜 秀英 敏 静 丽 强 磊 军 ' +
				'洋 勇 艳 杰 娟 涛 明 超 秀兰 霞 ' +
				'平 刚 桂英'
			).split(' ')
			return this.pick(names)
		},
		// 随机生成一个常见的中文姓名。
		cname: function() {
			return this.cfirst() + this.clast()
		}
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	/*
	    ## Web
	*/
	module.exports = {
	    /*
	        随机生成一个 URL。

	        [URL 规范](http://www.w3.org/Addressing/URL/url-spec.txt)
	            http                    Hypertext Transfer Protocol 
	            ftp                     File Transfer protocol 
	            gopher                  The Gopher protocol 
	            mailto                  Electronic mail address 
	            mid                     Message identifiers for electronic mail 
	            cid                     Content identifiers for MIME body part 
	            news                    Usenet news 
	            nntp                    Usenet news for local NNTP access only 
	            prospero                Access using the prospero protocols 
	            telnet rlogin tn3270    Reference to interactive sessions
	            wais                    Wide Area Information Servers 
	    */
	    url: function(protocol, host) {
	        return (protocol || this.protocol()) + '://' + // protocol?
	            (host || this.domain()) + // host?
	            '/' + this.word()
	    },
	    // 随机生成一个 URL 协议。
	    protocol: function() {
	        return this.pick(
	            // 协议簇
	            'http ftp gopher mailto mid cid news nntp prospero telnet rlogin tn3270 wais'.split(' ')
	        )
	    },
	    // 随机生成一个域名。
	    domain: function(tld) {
	        return this.word() + '.' + (tld || this.tld())
	    },
	    /*
	        随机生成一个顶级域名。
	        国际顶级域名 international top-level domain-names, iTLDs
	        国家顶级域名 national top-level domainnames, nTLDs
	        [域名后缀大全](http://www.163ns.com/zixun/post/4417.html)
	    */
	    tld: function() { // Top Level Domain
	        return this.pick(
	            (
	                // 域名后缀
	                'com net org edu gov int mil cn ' +
	                // 国内域名
	                'com.cn net.cn gov.cn org.cn ' +
	                // 中文国内域名
	                '中国 中国互联.公司 中国互联.网络 ' +
	                // 新国际域名
	                'tel biz cc tv info name hk mobi asia cd travel pro museum coop aero ' +
	                // 世界各国域名后缀
	                'ad ae af ag ai al am an ao aq ar as at au aw az ba bb bd be bf bg bh bi bj bm bn bo br bs bt bv bw by bz ca cc cf cg ch ci ck cl cm cn co cq cr cu cv cx cy cz de dj dk dm do dz ec ee eg eh es et ev fi fj fk fm fo fr ga gb gd ge gf gh gi gl gm gn gp gr gt gu gw gy hk hm hn hr ht hu id ie il in io iq ir is it jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md mg mh ml mm mn mo mp mq mr ms mt mv mw mx my mz na nc ne nf ng ni nl no np nr nt nu nz om qa pa pe pf pg ph pk pl pm pn pr pt pw py re ro ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr st su sy sz tc td tf tg th tj tk tm tn to tp tr tt tv tw tz ua ug uk us uy va vc ve vg vn vu wf ws ye yu za zm zr zw'
	            ).split(' ')
	        )
	    },
	    // 随机生成一个邮件地址。
	    email: function(domain) {
	        return this.character('lower') + '.' + this.word() + '@' +
	            (
	                domain ||
	                (this.word() + '.' + this.tld())
	            )
	            // return this.character('lower') + '.' + this.last().toLowerCase() + '@' + this.last().toLowerCase() + '.' + this.tld()
	            // return this.word() + '@' + (domain || this.domain())
	    },
	    // 随机生成一个 IP 地址。
	    ip: function() {
	        return this.natural(0, 255) + '.' +
	            this.natural(0, 255) + '.' +
	            this.natural(0, 255) + '.' +
	            this.natural(0, 255)
	    }
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Address
	*/

	var DICT = __webpack_require__(18)
	var REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北']

	module.exports = {
	    // 随机生成一个大区。
	    region: function() {
	        return this.pick(REGION)
	    },
	    // 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
	    province: function() {
	        return this.pick(DICT).name
	    },
	    // 随机生成一个（中国）市。
	    city: function(prefix) {
	        var province = this.pick(DICT)
	        var city = this.pick(province.children)
	        return prefix ? [province.name, city.name].join(' ') : city.name
	    },
	    // 随机生成一个（中国）县。
	    county: function(prefix) {
	        var province = this.pick(DICT)
	        var city = this.pick(province.children)
	        var county = this.pick(city.children) || {
	            name: '-'
	        }
	        return prefix ? [province.name, city.name, county.name].join(' ') : county.name
	    },
	    // 随机生成一个邮政编码（六位数字）。
	    zip: function(len) {
	        var zip = ''
	        for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9)
	        return zip
	    }

	    // address: function() {},
	    // phone: function() {},
	    // areacode: function() {},
	    // street: function() {},
	    // street_suffixes: function() {},
	    // street_suffix: function() {},
	    // states: function() {},
	    // state: function() {},
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	/*
	    ## Address 字典数据

	    字典数据来源 http://www.atatech.org/articles/30028?rnd=254259856

	    国标 省（市）级行政区划码表

	    华北   北京市 天津市 河北省 山西省 内蒙古自治区
	    东北   辽宁省 吉林省 黑龙江省
	    华东   上海市 江苏省 浙江省 安徽省 福建省 江西省 山东省
	    华南   广东省 广西壮族自治区 海南省
	    华中   河南省 湖北省 湖南省
	    西南   重庆市 四川省 贵州省 云南省 西藏自治区
	    西北   陕西省 甘肃省 青海省 宁夏回族自治区 新疆维吾尔自治区
	    港澳台 香港特别行政区 澳门特别行政区 台湾省
	    
	    **排序**
	    
	    ```js
	    var map = {}
	    _.each(_.keys(REGIONS),function(id){
	      map[id] = REGIONS[ID]
	    })
	    JSON.stringify(map)
	    ```
	*/
	var DICT = {
	    "110000": "北京",
	    "110100": "北京市",
	    "110101": "东城区",
	    "110102": "西城区",
	    "110105": "朝阳区",
	    "110106": "丰台区",
	    "110107": "石景山区",
	    "110108": "海淀区",
	    "110109": "门头沟区",
	    "110111": "房山区",
	    "110112": "通州区",
	    "110113": "顺义区",
	    "110114": "昌平区",
	    "110115": "大兴区",
	    "110116": "怀柔区",
	    "110117": "平谷区",
	    "110228": "密云县",
	    "110229": "延庆县",
	    "110230": "其它区",
	    "120000": "天津",
	    "120100": "天津市",
	    "120101": "和平区",
	    "120102": "河东区",
	    "120103": "河西区",
	    "120104": "南开区",
	    "120105": "河北区",
	    "120106": "红桥区",
	    "120110": "东丽区",
	    "120111": "西青区",
	    "120112": "津南区",
	    "120113": "北辰区",
	    "120114": "武清区",
	    "120115": "宝坻区",
	    "120116": "滨海新区",
	    "120221": "宁河县",
	    "120223": "静海县",
	    "120225": "蓟县",
	    "120226": "其它区",
	    "130000": "河北省",
	    "130100": "石家庄市",
	    "130102": "长安区",
	    "130103": "桥东区",
	    "130104": "桥西区",
	    "130105": "新华区",
	    "130107": "井陉矿区",
	    "130108": "裕华区",
	    "130121": "井陉县",
	    "130123": "正定县",
	    "130124": "栾城县",
	    "130125": "行唐县",
	    "130126": "灵寿县",
	    "130127": "高邑县",
	    "130128": "深泽县",
	    "130129": "赞皇县",
	    "130130": "无极县",
	    "130131": "平山县",
	    "130132": "元氏县",
	    "130133": "赵县",
	    "130181": "辛集市",
	    "130182": "藁城市",
	    "130183": "晋州市",
	    "130184": "新乐市",
	    "130185": "鹿泉市",
	    "130186": "其它区",
	    "130200": "唐山市",
	    "130202": "路南区",
	    "130203": "路北区",
	    "130204": "古冶区",
	    "130205": "开平区",
	    "130207": "丰南区",
	    "130208": "丰润区",
	    "130223": "滦县",
	    "130224": "滦南县",
	    "130225": "乐亭县",
	    "130227": "迁西县",
	    "130229": "玉田县",
	    "130230": "曹妃甸区",
	    "130281": "遵化市",
	    "130283": "迁安市",
	    "130284": "其它区",
	    "130300": "秦皇岛市",
	    "130302": "海港区",
	    "130303": "山海关区",
	    "130304": "北戴河区",
	    "130321": "青龙满族自治县",
	    "130322": "昌黎县",
	    "130323": "抚宁县",
	    "130324": "卢龙县",
	    "130398": "其它区",
	    "130400": "邯郸市",
	    "130402": "邯山区",
	    "130403": "丛台区",
	    "130404": "复兴区",
	    "130406": "峰峰矿区",
	    "130421": "邯郸县",
	    "130423": "临漳县",
	    "130424": "成安县",
	    "130425": "大名县",
	    "130426": "涉县",
	    "130427": "磁县",
	    "130428": "肥乡县",
	    "130429": "永年县",
	    "130430": "邱县",
	    "130431": "鸡泽县",
	    "130432": "广平县",
	    "130433": "馆陶县",
	    "130434": "魏县",
	    "130435": "曲周县",
	    "130481": "武安市",
	    "130482": "其它区",
	    "130500": "邢台市",
	    "130502": "桥东区",
	    "130503": "桥西区",
	    "130521": "邢台县",
	    "130522": "临城县",
	    "130523": "内丘县",
	    "130524": "柏乡县",
	    "130525": "隆尧县",
	    "130526": "任县",
	    "130527": "南和县",
	    "130528": "宁晋县",
	    "130529": "巨鹿县",
	    "130530": "新河县",
	    "130531": "广宗县",
	    "130532": "平乡县",
	    "130533": "威县",
	    "130534": "清河县",
	    "130535": "临西县",
	    "130581": "南宫市",
	    "130582": "沙河市",
	    "130583": "其它区",
	    "130600": "保定市",
	    "130602": "新市区",
	    "130603": "北市区",
	    "130604": "南市区",
	    "130621": "满城县",
	    "130622": "清苑县",
	    "130623": "涞水县",
	    "130624": "阜平县",
	    "130625": "徐水县",
	    "130626": "定兴县",
	    "130627": "唐县",
	    "130628": "高阳县",
	    "130629": "容城县",
	    "130630": "涞源县",
	    "130631": "望都县",
	    "130632": "安新县",
	    "130633": "易县",
	    "130634": "曲阳县",
	    "130635": "蠡县",
	    "130636": "顺平县",
	    "130637": "博野县",
	    "130638": "雄县",
	    "130681": "涿州市",
	    "130682": "定州市",
	    "130683": "安国市",
	    "130684": "高碑店市",
	    "130699": "其它区",
	    "130700": "张家口市",
	    "130702": "桥东区",
	    "130703": "桥西区",
	    "130705": "宣化区",
	    "130706": "下花园区",
	    "130721": "宣化县",
	    "130722": "张北县",
	    "130723": "康保县",
	    "130724": "沽源县",
	    "130725": "尚义县",
	    "130726": "蔚县",
	    "130727": "阳原县",
	    "130728": "怀安县",
	    "130729": "万全县",
	    "130730": "怀来县",
	    "130731": "涿鹿县",
	    "130732": "赤城县",
	    "130733": "崇礼县",
	    "130734": "其它区",
	    "130800": "承德市",
	    "130802": "双桥区",
	    "130803": "双滦区",
	    "130804": "鹰手营子矿区",
	    "130821": "承德县",
	    "130822": "兴隆县",
	    "130823": "平泉县",
	    "130824": "滦平县",
	    "130825": "隆化县",
	    "130826": "丰宁满族自治县",
	    "130827": "宽城满族自治县",
	    "130828": "围场满族蒙古族自治县",
	    "130829": "其它区",
	    "130900": "沧州市",
	    "130902": "新华区",
	    "130903": "运河区",
	    "130921": "沧县",
	    "130922": "青县",
	    "130923": "东光县",
	    "130924": "海兴县",
	    "130925": "盐山县",
	    "130926": "肃宁县",
	    "130927": "南皮县",
	    "130928": "吴桥县",
	    "130929": "献县",
	    "130930": "孟村回族自治县",
	    "130981": "泊头市",
	    "130982": "任丘市",
	    "130983": "黄骅市",
	    "130984": "河间市",
	    "130985": "其它区",
	    "131000": "廊坊市",
	    "131002": "安次区",
	    "131003": "广阳区",
	    "131022": "固安县",
	    "131023": "永清县",
	    "131024": "香河县",
	    "131025": "大城县",
	    "131026": "文安县",
	    "131028": "大厂回族自治县",
	    "131081": "霸州市",
	    "131082": "三河市",
	    "131083": "其它区",
	    "131100": "衡水市",
	    "131102": "桃城区",
	    "131121": "枣强县",
	    "131122": "武邑县",
	    "131123": "武强县",
	    "131124": "饶阳县",
	    "131125": "安平县",
	    "131126": "故城县",
	    "131127": "景县",
	    "131128": "阜城县",
	    "131181": "冀州市",
	    "131182": "深州市",
	    "131183": "其它区",
	    "140000": "山西省",
	    "140100": "太原市",
	    "140105": "小店区",
	    "140106": "迎泽区",
	    "140107": "杏花岭区",
	    "140108": "尖草坪区",
	    "140109": "万柏林区",
	    "140110": "晋源区",
	    "140121": "清徐县",
	    "140122": "阳曲县",
	    "140123": "娄烦县",
	    "140181": "古交市",
	    "140182": "其它区",
	    "140200": "大同市",
	    "140202": "城区",
	    "140203": "矿区",
	    "140211": "南郊区",
	    "140212": "新荣区",
	    "140221": "阳高县",
	    "140222": "天镇县",
	    "140223": "广灵县",
	    "140224": "灵丘县",
	    "140225": "浑源县",
	    "140226": "左云县",
	    "140227": "大同县",
	    "140228": "其它区",
	    "140300": "阳泉市",
	    "140302": "城区",
	    "140303": "矿区",
	    "140311": "郊区",
	    "140321": "平定县",
	    "140322": "盂县",
	    "140323": "其它区",
	    "140400": "长治市",
	    "140421": "长治县",
	    "140423": "襄垣县",
	    "140424": "屯留县",
	    "140425": "平顺县",
	    "140426": "黎城县",
	    "140427": "壶关县",
	    "140428": "长子县",
	    "140429": "武乡县",
	    "140430": "沁县",
	    "140431": "沁源县",
	    "140481": "潞城市",
	    "140482": "城区",
	    "140483": "郊区",
	    "140485": "其它区",
	    "140500": "晋城市",
	    "140502": "城区",
	    "140521": "沁水县",
	    "140522": "阳城县",
	    "140524": "陵川县",
	    "140525": "泽州县",
	    "140581": "高平市",
	    "140582": "其它区",
	    "140600": "朔州市",
	    "140602": "朔城区",
	    "140603": "平鲁区",
	    "140621": "山阴县",
	    "140622": "应县",
	    "140623": "右玉县",
	    "140624": "怀仁县",
	    "140625": "其它区",
	    "140700": "晋中市",
	    "140702": "榆次区",
	    "140721": "榆社县",
	    "140722": "左权县",
	    "140723": "和顺县",
	    "140724": "昔阳县",
	    "140725": "寿阳县",
	    "140726": "太谷县",
	    "140727": "祁县",
	    "140728": "平遥县",
	    "140729": "灵石县",
	    "140781": "介休市",
	    "140782": "其它区",
	    "140800": "运城市",
	    "140802": "盐湖区",
	    "140821": "临猗县",
	    "140822": "万荣县",
	    "140823": "闻喜县",
	    "140824": "稷山县",
	    "140825": "新绛县",
	    "140826": "绛县",
	    "140827": "垣曲县",
	    "140828": "夏县",
	    "140829": "平陆县",
	    "140830": "芮城县",
	    "140881": "永济市",
	    "140882": "河津市",
	    "140883": "其它区",
	    "140900": "忻州市",
	    "140902": "忻府区",
	    "140921": "定襄县",
	    "140922": "五台县",
	    "140923": "代县",
	    "140924": "繁峙县",
	    "140925": "宁武县",
	    "140926": "静乐县",
	    "140927": "神池县",
	    "140928": "五寨县",
	    "140929": "岢岚县",
	    "140930": "河曲县",
	    "140931": "保德县",
	    "140932": "偏关县",
	    "140981": "原平市",
	    "140982": "其它区",
	    "141000": "临汾市",
	    "141002": "尧都区",
	    "141021": "曲沃县",
	    "141022": "翼城县",
	    "141023": "襄汾县",
	    "141024": "洪洞县",
	    "141025": "古县",
	    "141026": "安泽县",
	    "141027": "浮山县",
	    "141028": "吉县",
	    "141029": "乡宁县",
	    "141030": "大宁县",
	    "141031": "隰县",
	    "141032": "永和县",
	    "141033": "蒲县",
	    "141034": "汾西县",
	    "141081": "侯马市",
	    "141082": "霍州市",
	    "141083": "其它区",
	    "141100": "吕梁市",
	    "141102": "离石区",
	    "141121": "文水县",
	    "141122": "交城县",
	    "141123": "兴县",
	    "141124": "临县",
	    "141125": "柳林县",
	    "141126": "石楼县",
	    "141127": "岚县",
	    "141128": "方山县",
	    "141129": "中阳县",
	    "141130": "交口县",
	    "141181": "孝义市",
	    "141182": "汾阳市",
	    "141183": "其它区",
	    "150000": "内蒙古自治区",
	    "150100": "呼和浩特市",
	    "150102": "新城区",
	    "150103": "回民区",
	    "150104": "玉泉区",
	    "150105": "赛罕区",
	    "150121": "土默特左旗",
	    "150122": "托克托县",
	    "150123": "和林格尔县",
	    "150124": "清水河县",
	    "150125": "武川县",
	    "150126": "其它区",
	    "150200": "包头市",
	    "150202": "东河区",
	    "150203": "昆都仑区",
	    "150204": "青山区",
	    "150205": "石拐区",
	    "150206": "白云鄂博矿区",
	    "150207": "九原区",
	    "150221": "土默特右旗",
	    "150222": "固阳县",
	    "150223": "达尔罕茂明安联合旗",
	    "150224": "其它区",
	    "150300": "乌海市",
	    "150302": "海勃湾区",
	    "150303": "海南区",
	    "150304": "乌达区",
	    "150305": "其它区",
	    "150400": "赤峰市",
	    "150402": "红山区",
	    "150403": "元宝山区",
	    "150404": "松山区",
	    "150421": "阿鲁科尔沁旗",
	    "150422": "巴林左旗",
	    "150423": "巴林右旗",
	    "150424": "林西县",
	    "150425": "克什克腾旗",
	    "150426": "翁牛特旗",
	    "150428": "喀喇沁旗",
	    "150429": "宁城县",
	    "150430": "敖汉旗",
	    "150431": "其它区",
	    "150500": "通辽市",
	    "150502": "科尔沁区",
	    "150521": "科尔沁左翼中旗",
	    "150522": "科尔沁左翼后旗",
	    "150523": "开鲁县",
	    "150524": "库伦旗",
	    "150525": "奈曼旗",
	    "150526": "扎鲁特旗",
	    "150581": "霍林郭勒市",
	    "150582": "其它区",
	    "150600": "鄂尔多斯市",
	    "150602": "东胜区",
	    "150621": "达拉特旗",
	    "150622": "准格尔旗",
	    "150623": "鄂托克前旗",
	    "150624": "鄂托克旗",
	    "150625": "杭锦旗",
	    "150626": "乌审旗",
	    "150627": "伊金霍洛旗",
	    "150628": "其它区",
	    "150700": "呼伦贝尔市",
	    "150702": "海拉尔区",
	    "150703": "扎赉诺尔区",
	    "150721": "阿荣旗",
	    "150722": "莫力达瓦达斡尔族自治旗",
	    "150723": "鄂伦春自治旗",
	    "150724": "鄂温克族自治旗",
	    "150725": "陈巴尔虎旗",
	    "150726": "新巴尔虎左旗",
	    "150727": "新巴尔虎右旗",
	    "150781": "满洲里市",
	    "150782": "牙克石市",
	    "150783": "扎兰屯市",
	    "150784": "额尔古纳市",
	    "150785": "根河市",
	    "150786": "其它区",
	    "150800": "巴彦淖尔市",
	    "150802": "临河区",
	    "150821": "五原县",
	    "150822": "磴口县",
	    "150823": "乌拉特前旗",
	    "150824": "乌拉特中旗",
	    "150825": "乌拉特后旗",
	    "150826": "杭锦后旗",
	    "150827": "其它区",
	    "150900": "乌兰察布市",
	    "150902": "集宁区",
	    "150921": "卓资县",
	    "150922": "化德县",
	    "150923": "商都县",
	    "150924": "兴和县",
	    "150925": "凉城县",
	    "150926": "察哈尔右翼前旗",
	    "150927": "察哈尔右翼中旗",
	    "150928": "察哈尔右翼后旗",
	    "150929": "四子王旗",
	    "150981": "丰镇市",
	    "150982": "其它区",
	    "152200": "兴安盟",
	    "152201": "乌兰浩特市",
	    "152202": "阿尔山市",
	    "152221": "科尔沁右翼前旗",
	    "152222": "科尔沁右翼中旗",
	    "152223": "扎赉特旗",
	    "152224": "突泉县",
	    "152225": "其它区",
	    "152500": "锡林郭勒盟",
	    "152501": "二连浩特市",
	    "152502": "锡林浩特市",
	    "152522": "阿巴嘎旗",
	    "152523": "苏尼特左旗",
	    "152524": "苏尼特右旗",
	    "152525": "东乌珠穆沁旗",
	    "152526": "西乌珠穆沁旗",
	    "152527": "太仆寺旗",
	    "152528": "镶黄旗",
	    "152529": "正镶白旗",
	    "152530": "正蓝旗",
	    "152531": "多伦县",
	    "152532": "其它区",
	    "152900": "阿拉善盟",
	    "152921": "阿拉善左旗",
	    "152922": "阿拉善右旗",
	    "152923": "额济纳旗",
	    "152924": "其它区",
	    "210000": "辽宁省",
	    "210100": "沈阳市",
	    "210102": "和平区",
	    "210103": "沈河区",
	    "210104": "大东区",
	    "210105": "皇姑区",
	    "210106": "铁西区",
	    "210111": "苏家屯区",
	    "210112": "东陵区",
	    "210113": "新城子区",
	    "210114": "于洪区",
	    "210122": "辽中县",
	    "210123": "康平县",
	    "210124": "法库县",
	    "210181": "新民市",
	    "210184": "沈北新区",
	    "210185": "其它区",
	    "210200": "大连市",
	    "210202": "中山区",
	    "210203": "西岗区",
	    "210204": "沙河口区",
	    "210211": "甘井子区",
	    "210212": "旅顺口区",
	    "210213": "金州区",
	    "210224": "长海县",
	    "210281": "瓦房店市",
	    "210282": "普兰店市",
	    "210283": "庄河市",
	    "210298": "其它区",
	    "210300": "鞍山市",
	    "210302": "铁东区",
	    "210303": "铁西区",
	    "210304": "立山区",
	    "210311": "千山区",
	    "210321": "台安县",
	    "210323": "岫岩满族自治县",
	    "210381": "海城市",
	    "210382": "其它区",
	    "210400": "抚顺市",
	    "210402": "新抚区",
	    "210403": "东洲区",
	    "210404": "望花区",
	    "210411": "顺城区",
	    "210421": "抚顺县",
	    "210422": "新宾满族自治县",
	    "210423": "清原满族自治县",
	    "210424": "其它区",
	    "210500": "本溪市",
	    "210502": "平山区",
	    "210503": "溪湖区",
	    "210504": "明山区",
	    "210505": "南芬区",
	    "210521": "本溪满族自治县",
	    "210522": "桓仁满族自治县",
	    "210523": "其它区",
	    "210600": "丹东市",
	    "210602": "元宝区",
	    "210603": "振兴区",
	    "210604": "振安区",
	    "210624": "宽甸满族自治县",
	    "210681": "东港市",
	    "210682": "凤城市",
	    "210683": "其它区",
	    "210700": "锦州市",
	    "210702": "古塔区",
	    "210703": "凌河区",
	    "210711": "太和区",
	    "210726": "黑山县",
	    "210727": "义县",
	    "210781": "凌海市",
	    "210782": "北镇市",
	    "210783": "其它区",
	    "210800": "营口市",
	    "210802": "站前区",
	    "210803": "西市区",
	    "210804": "鲅鱼圈区",
	    "210811": "老边区",
	    "210881": "盖州市",
	    "210882": "大石桥市",
	    "210883": "其它区",
	    "210900": "阜新市",
	    "210902": "海州区",
	    "210903": "新邱区",
	    "210904": "太平区",
	    "210905": "清河门区",
	    "210911": "细河区",
	    "210921": "阜新蒙古族自治县",
	    "210922": "彰武县",
	    "210923": "其它区",
	    "211000": "辽阳市",
	    "211002": "白塔区",
	    "211003": "文圣区",
	    "211004": "宏伟区",
	    "211005": "弓长岭区",
	    "211011": "太子河区",
	    "211021": "辽阳县",
	    "211081": "灯塔市",
	    "211082": "其它区",
	    "211100": "盘锦市",
	    "211102": "双台子区",
	    "211103": "兴隆台区",
	    "211121": "大洼县",
	    "211122": "盘山县",
	    "211123": "其它区",
	    "211200": "铁岭市",
	    "211202": "银州区",
	    "211204": "清河区",
	    "211221": "铁岭县",
	    "211223": "西丰县",
	    "211224": "昌图县",
	    "211281": "调兵山市",
	    "211282": "开原市",
	    "211283": "其它区",
	    "211300": "朝阳市",
	    "211302": "双塔区",
	    "211303": "龙城区",
	    "211321": "朝阳县",
	    "211322": "建平县",
	    "211324": "喀喇沁左翼蒙古族自治县",
	    "211381": "北票市",
	    "211382": "凌源市",
	    "211383": "其它区",
	    "211400": "葫芦岛市",
	    "211402": "连山区",
	    "211403": "龙港区",
	    "211404": "南票区",
	    "211421": "绥中县",
	    "211422": "建昌县",
	    "211481": "兴城市",
	    "211482": "其它区",
	    "220000": "吉林省",
	    "220100": "长春市",
	    "220102": "南关区",
	    "220103": "宽城区",
	    "220104": "朝阳区",
	    "220105": "二道区",
	    "220106": "绿园区",
	    "220112": "双阳区",
	    "220122": "农安县",
	    "220181": "九台市",
	    "220182": "榆树市",
	    "220183": "德惠市",
	    "220188": "其它区",
	    "220200": "吉林市",
	    "220202": "昌邑区",
	    "220203": "龙潭区",
	    "220204": "船营区",
	    "220211": "丰满区",
	    "220221": "永吉县",
	    "220281": "蛟河市",
	    "220282": "桦甸市",
	    "220283": "舒兰市",
	    "220284": "磐石市",
	    "220285": "其它区",
	    "220300": "四平市",
	    "220302": "铁西区",
	    "220303": "铁东区",
	    "220322": "梨树县",
	    "220323": "伊通满族自治县",
	    "220381": "公主岭市",
	    "220382": "双辽市",
	    "220383": "其它区",
	    "220400": "辽源市",
	    "220402": "龙山区",
	    "220403": "西安区",
	    "220421": "东丰县",
	    "220422": "东辽县",
	    "220423": "其它区",
	    "220500": "通化市",
	    "220502": "东昌区",
	    "220503": "二道江区",
	    "220521": "通化县",
	    "220523": "辉南县",
	    "220524": "柳河县",
	    "220581": "梅河口市",
	    "220582": "集安市",
	    "220583": "其它区",
	    "220600": "白山市",
	    "220602": "浑江区",
	    "220621": "抚松县",
	    "220622": "靖宇县",
	    "220623": "长白朝鲜族自治县",
	    "220625": "江源区",
	    "220681": "临江市",
	    "220682": "其它区",
	    "220700": "松原市",
	    "220702": "宁江区",
	    "220721": "前郭尔罗斯蒙古族自治县",
	    "220722": "长岭县",
	    "220723": "乾安县",
	    "220724": "扶余市",
	    "220725": "其它区",
	    "220800": "白城市",
	    "220802": "洮北区",
	    "220821": "镇赉县",
	    "220822": "通榆县",
	    "220881": "洮南市",
	    "220882": "大安市",
	    "220883": "其它区",
	    "222400": "延边朝鲜族自治州",
	    "222401": "延吉市",
	    "222402": "图们市",
	    "222403": "敦化市",
	    "222404": "珲春市",
	    "222405": "龙井市",
	    "222406": "和龙市",
	    "222424": "汪清县",
	    "222426": "安图县",
	    "222427": "其它区",
	    "230000": "黑龙江省",
	    "230100": "哈尔滨市",
	    "230102": "道里区",
	    "230103": "南岗区",
	    "230104": "道外区",
	    "230106": "香坊区",
	    "230108": "平房区",
	    "230109": "松北区",
	    "230111": "呼兰区",
	    "230123": "依兰县",
	    "230124": "方正县",
	    "230125": "宾县",
	    "230126": "巴彦县",
	    "230127": "木兰县",
	    "230128": "通河县",
	    "230129": "延寿县",
	    "230181": "阿城区",
	    "230182": "双城市",
	    "230183": "尚志市",
	    "230184": "五常市",
	    "230186": "其它区",
	    "230200": "齐齐哈尔市",
	    "230202": "龙沙区",
	    "230203": "建华区",
	    "230204": "铁锋区",
	    "230205": "昂昂溪区",
	    "230206": "富拉尔基区",
	    "230207": "碾子山区",
	    "230208": "梅里斯达斡尔族区",
	    "230221": "龙江县",
	    "230223": "依安县",
	    "230224": "泰来县",
	    "230225": "甘南县",
	    "230227": "富裕县",
	    "230229": "克山县",
	    "230230": "克东县",
	    "230231": "拜泉县",
	    "230281": "讷河市",
	    "230282": "其它区",
	    "230300": "鸡西市",
	    "230302": "鸡冠区",
	    "230303": "恒山区",
	    "230304": "滴道区",
	    "230305": "梨树区",
	    "230306": "城子河区",
	    "230307": "麻山区",
	    "230321": "鸡东县",
	    "230381": "虎林市",
	    "230382": "密山市",
	    "230383": "其它区",
	    "230400": "鹤岗市",
	    "230402": "向阳区",
	    "230403": "工农区",
	    "230404": "南山区",
	    "230405": "兴安区",
	    "230406": "东山区",
	    "230407": "兴山区",
	    "230421": "萝北县",
	    "230422": "绥滨县",
	    "230423": "其它区",
	    "230500": "双鸭山市",
	    "230502": "尖山区",
	    "230503": "岭东区",
	    "230505": "四方台区",
	    "230506": "宝山区",
	    "230521": "集贤县",
	    "230522": "友谊县",
	    "230523": "宝清县",
	    "230524": "饶河县",
	    "230525": "其它区",
	    "230600": "大庆市",
	    "230602": "萨尔图区",
	    "230603": "龙凤区",
	    "230604": "让胡路区",
	    "230605": "红岗区",
	    "230606": "大同区",
	    "230621": "肇州县",
	    "230622": "肇源县",
	    "230623": "林甸县",
	    "230624": "杜尔伯特蒙古族自治县",
	    "230625": "其它区",
	    "230700": "伊春市",
	    "230702": "伊春区",
	    "230703": "南岔区",
	    "230704": "友好区",
	    "230705": "西林区",
	    "230706": "翠峦区",
	    "230707": "新青区",
	    "230708": "美溪区",
	    "230709": "金山屯区",
	    "230710": "五营区",
	    "230711": "乌马河区",
	    "230712": "汤旺河区",
	    "230713": "带岭区",
	    "230714": "乌伊岭区",
	    "230715": "红星区",
	    "230716": "上甘岭区",
	    "230722": "嘉荫县",
	    "230781": "铁力市",
	    "230782": "其它区",
	    "230800": "佳木斯市",
	    "230803": "向阳区",
	    "230804": "前进区",
	    "230805": "东风区",
	    "230811": "郊区",
	    "230822": "桦南县",
	    "230826": "桦川县",
	    "230828": "汤原县",
	    "230833": "抚远县",
	    "230881": "同江市",
	    "230882": "富锦市",
	    "230883": "其它区",
	    "230900": "七台河市",
	    "230902": "新兴区",
	    "230903": "桃山区",
	    "230904": "茄子河区",
	    "230921": "勃利县",
	    "230922": "其它区",
	    "231000": "牡丹江市",
	    "231002": "东安区",
	    "231003": "阳明区",
	    "231004": "爱民区",
	    "231005": "西安区",
	    "231024": "东宁县",
	    "231025": "林口县",
	    "231081": "绥芬河市",
	    "231083": "海林市",
	    "231084": "宁安市",
	    "231085": "穆棱市",
	    "231086": "其它区",
	    "231100": "黑河市",
	    "231102": "爱辉区",
	    "231121": "嫩江县",
	    "231123": "逊克县",
	    "231124": "孙吴县",
	    "231181": "北安市",
	    "231182": "五大连池市",
	    "231183": "其它区",
	    "231200": "绥化市",
	    "231202": "北林区",
	    "231221": "望奎县",
	    "231222": "兰西县",
	    "231223": "青冈县",
	    "231224": "庆安县",
	    "231225": "明水县",
	    "231226": "绥棱县",
	    "231281": "安达市",
	    "231282": "肇东市",
	    "231283": "海伦市",
	    "231284": "其它区",
	    "232700": "大兴安岭地区",
	    "232702": "松岭区",
	    "232703": "新林区",
	    "232704": "呼中区",
	    "232721": "呼玛县",
	    "232722": "塔河县",
	    "232723": "漠河县",
	    "232724": "加格达奇区",
	    "232725": "其它区",
	    "310000": "上海",
	    "310100": "上海市",
	    "310101": "黄浦区",
	    "310104": "徐汇区",
	    "310105": "长宁区",
	    "310106": "静安区",
	    "310107": "普陀区",
	    "310108": "闸北区",
	    "310109": "虹口区",
	    "310110": "杨浦区",
	    "310112": "闵行区",
	    "310113": "宝山区",
	    "310114": "嘉定区",
	    "310115": "浦东新区",
	    "310116": "金山区",
	    "310117": "松江区",
	    "310118": "青浦区",
	    "310120": "奉贤区",
	    "310230": "崇明县",
	    "310231": "其它区",
	    "320000": "江苏省",
	    "320100": "南京市",
	    "320102": "玄武区",
	    "320104": "秦淮区",
	    "320105": "建邺区",
	    "320106": "鼓楼区",
	    "320111": "浦口区",
	    "320113": "栖霞区",
	    "320114": "雨花台区",
	    "320115": "江宁区",
	    "320116": "六合区",
	    "320124": "溧水区",
	    "320125": "高淳区",
	    "320126": "其它区",
	    "320200": "无锡市",
	    "320202": "崇安区",
	    "320203": "南长区",
	    "320204": "北塘区",
	    "320205": "锡山区",
	    "320206": "惠山区",
	    "320211": "滨湖区",
	    "320281": "江阴市",
	    "320282": "宜兴市",
	    "320297": "其它区",
	    "320300": "徐州市",
	    "320302": "鼓楼区",
	    "320303": "云龙区",
	    "320305": "贾汪区",
	    "320311": "泉山区",
	    "320321": "丰县",
	    "320322": "沛县",
	    "320323": "铜山区",
	    "320324": "睢宁县",
	    "320381": "新沂市",
	    "320382": "邳州市",
	    "320383": "其它区",
	    "320400": "常州市",
	    "320402": "天宁区",
	    "320404": "钟楼区",
	    "320405": "戚墅堰区",
	    "320411": "新北区",
	    "320412": "武进区",
	    "320481": "溧阳市",
	    "320482": "金坛市",
	    "320483": "其它区",
	    "320500": "苏州市",
	    "320505": "虎丘区",
	    "320506": "吴中区",
	    "320507": "相城区",
	    "320508": "姑苏区",
	    "320581": "常熟市",
	    "320582": "张家港市",
	    "320583": "昆山市",
	    "320584": "吴江区",
	    "320585": "太仓市",
	    "320596": "其它区",
	    "320600": "南通市",
	    "320602": "崇川区",
	    "320611": "港闸区",
	    "320612": "通州区",
	    "320621": "海安县",
	    "320623": "如东县",
	    "320681": "启东市",
	    "320682": "如皋市",
	    "320684": "海门市",
	    "320694": "其它区",
	    "320700": "连云港市",
	    "320703": "连云区",
	    "320705": "新浦区",
	    "320706": "海州区",
	    "320721": "赣榆县",
	    "320722": "东海县",
	    "320723": "灌云县",
	    "320724": "灌南县",
	    "320725": "其它区",
	    "320800": "淮安市",
	    "320802": "清河区",
	    "320803": "淮安区",
	    "320804": "淮阴区",
	    "320811": "清浦区",
	    "320826": "涟水县",
	    "320829": "洪泽县",
	    "320830": "盱眙县",
	    "320831": "金湖县",
	    "320832": "其它区",
	    "320900": "盐城市",
	    "320902": "亭湖区",
	    "320903": "盐都区",
	    "320921": "响水县",
	    "320922": "滨海县",
	    "320923": "阜宁县",
	    "320924": "射阳县",
	    "320925": "建湖县",
	    "320981": "东台市",
	    "320982": "大丰市",
	    "320983": "其它区",
	    "321000": "扬州市",
	    "321002": "广陵区",
	    "321003": "邗江区",
	    "321023": "宝应县",
	    "321081": "仪征市",
	    "321084": "高邮市",
	    "321088": "江都区",
	    "321093": "其它区",
	    "321100": "镇江市",
	    "321102": "京口区",
	    "321111": "润州区",
	    "321112": "丹徒区",
	    "321181": "丹阳市",
	    "321182": "扬中市",
	    "321183": "句容市",
	    "321184": "其它区",
	    "321200": "泰州市",
	    "321202": "海陵区",
	    "321203": "高港区",
	    "321281": "兴化市",
	    "321282": "靖江市",
	    "321283": "泰兴市",
	    "321284": "姜堰区",
	    "321285": "其它区",
	    "321300": "宿迁市",
	    "321302": "宿城区",
	    "321311": "宿豫区",
	    "321322": "沭阳县",
	    "321323": "泗阳县",
	    "321324": "泗洪县",
	    "321325": "其它区",
	    "330000": "浙江省",
	    "330100": "杭州市",
	    "330102": "上城区",
	    "330103": "下城区",
	    "330104": "江干区",
	    "330105": "拱墅区",
	    "330106": "西湖区",
	    "330108": "滨江区",
	    "330109": "萧山区",
	    "330110": "余杭区",
	    "330122": "桐庐县",
	    "330127": "淳安县",
	    "330182": "建德市",
	    "330183": "富阳市",
	    "330185": "临安市",
	    "330186": "其它区",
	    "330200": "宁波市",
	    "330203": "海曙区",
	    "330204": "江东区",
	    "330205": "江北区",
	    "330206": "北仑区",
	    "330211": "镇海区",
	    "330212": "鄞州区",
	    "330225": "象山县",
	    "330226": "宁海县",
	    "330281": "余姚市",
	    "330282": "慈溪市",
	    "330283": "奉化市",
	    "330284": "其它区",
	    "330300": "温州市",
	    "330302": "鹿城区",
	    "330303": "龙湾区",
	    "330304": "瓯海区",
	    "330322": "洞头县",
	    "330324": "永嘉县",
	    "330326": "平阳县",
	    "330327": "苍南县",
	    "330328": "文成县",
	    "330329": "泰顺县",
	    "330381": "瑞安市",
	    "330382": "乐清市",
	    "330383": "其它区",
	    "330400": "嘉兴市",
	    "330402": "南湖区",
	    "330411": "秀洲区",
	    "330421": "嘉善县",
	    "330424": "海盐县",
	    "330481": "海宁市",
	    "330482": "平湖市",
	    "330483": "桐乡市",
	    "330484": "其它区",
	    "330500": "湖州市",
	    "330502": "吴兴区",
	    "330503": "南浔区",
	    "330521": "德清县",
	    "330522": "长兴县",
	    "330523": "安吉县",
	    "330524": "其它区",
	    "330600": "绍兴市",
	    "330602": "越城区",
	    "330621": "绍兴县",
	    "330624": "新昌县",
	    "330681": "诸暨市",
	    "330682": "上虞市",
	    "330683": "嵊州市",
	    "330684": "其它区",
	    "330700": "金华市",
	    "330702": "婺城区",
	    "330703": "金东区",
	    "330723": "武义县",
	    "330726": "浦江县",
	    "330727": "磐安县",
	    "330781": "兰溪市",
	    "330782": "义乌市",
	    "330783": "东阳市",
	    "330784": "永康市",
	    "330785": "其它区",
	    "330800": "衢州市",
	    "330802": "柯城区",
	    "330803": "衢江区",
	    "330822": "常山县",
	    "330824": "开化县",
	    "330825": "龙游县",
	    "330881": "江山市",
	    "330882": "其它区",
	    "330900": "舟山市",
	    "330902": "定海区",
	    "330903": "普陀区",
	    "330921": "岱山县",
	    "330922": "嵊泗县",
	    "330923": "其它区",
	    "331000": "台州市",
	    "331002": "椒江区",
	    "331003": "黄岩区",
	    "331004": "路桥区",
	    "331021": "玉环县",
	    "331022": "三门县",
	    "331023": "天台县",
	    "331024": "仙居县",
	    "331081": "温岭市",
	    "331082": "临海市",
	    "331083": "其它区",
	    "331100": "丽水市",
	    "331102": "莲都区",
	    "331121": "青田县",
	    "331122": "缙云县",
	    "331123": "遂昌县",
	    "331124": "松阳县",
	    "331125": "云和县",
	    "331126": "庆元县",
	    "331127": "景宁畲族自治县",
	    "331181": "龙泉市",
	    "331182": "其它区",
	    "340000": "安徽省",
	    "340100": "合肥市",
	    "340102": "瑶海区",
	    "340103": "庐阳区",
	    "340104": "蜀山区",
	    "340111": "包河区",
	    "340121": "长丰县",
	    "340122": "肥东县",
	    "340123": "肥西县",
	    "340192": "其它区",
	    "340200": "芜湖市",
	    "340202": "镜湖区",
	    "340203": "弋江区",
	    "340207": "鸠江区",
	    "340208": "三山区",
	    "340221": "芜湖县",
	    "340222": "繁昌县",
	    "340223": "南陵县",
	    "340224": "其它区",
	    "340300": "蚌埠市",
	    "340302": "龙子湖区",
	    "340303": "蚌山区",
	    "340304": "禹会区",
	    "340311": "淮上区",
	    "340321": "怀远县",
	    "340322": "五河县",
	    "340323": "固镇县",
	    "340324": "其它区",
	    "340400": "淮南市",
	    "340402": "大通区",
	    "340403": "田家庵区",
	    "340404": "谢家集区",
	    "340405": "八公山区",
	    "340406": "潘集区",
	    "340421": "凤台县",
	    "340422": "其它区",
	    "340500": "马鞍山市",
	    "340503": "花山区",
	    "340504": "雨山区",
	    "340506": "博望区",
	    "340521": "当涂县",
	    "340522": "其它区",
	    "340600": "淮北市",
	    "340602": "杜集区",
	    "340603": "相山区",
	    "340604": "烈山区",
	    "340621": "濉溪县",
	    "340622": "其它区",
	    "340700": "铜陵市",
	    "340702": "铜官山区",
	    "340703": "狮子山区",
	    "340711": "郊区",
	    "340721": "铜陵县",
	    "340722": "其它区",
	    "340800": "安庆市",
	    "340802": "迎江区",
	    "340803": "大观区",
	    "340811": "宜秀区",
	    "340822": "怀宁县",
	    "340823": "枞阳县",
	    "340824": "潜山县",
	    "340825": "太湖县",
	    "340826": "宿松县",
	    "340827": "望江县",
	    "340828": "岳西县",
	    "340881": "桐城市",
	    "340882": "其它区",
	    "341000": "黄山市",
	    "341002": "屯溪区",
	    "341003": "黄山区",
	    "341004": "徽州区",
	    "341021": "歙县",
	    "341022": "休宁县",
	    "341023": "黟县",
	    "341024": "祁门县",
	    "341025": "其它区",
	    "341100": "滁州市",
	    "341102": "琅琊区",
	    "341103": "南谯区",
	    "341122": "来安县",
	    "341124": "全椒县",
	    "341125": "定远县",
	    "341126": "凤阳县",
	    "341181": "天长市",
	    "341182": "明光市",
	    "341183": "其它区",
	    "341200": "阜阳市",
	    "341202": "颍州区",
	    "341203": "颍东区",
	    "341204": "颍泉区",
	    "341221": "临泉县",
	    "341222": "太和县",
	    "341225": "阜南县",
	    "341226": "颍上县",
	    "341282": "界首市",
	    "341283": "其它区",
	    "341300": "宿州市",
	    "341302": "埇桥区",
	    "341321": "砀山县",
	    "341322": "萧县",
	    "341323": "灵璧县",
	    "341324": "泗县",
	    "341325": "其它区",
	    "341400": "巢湖市",
	    "341421": "庐江县",
	    "341422": "无为县",
	    "341423": "含山县",
	    "341424": "和县",
	    "341500": "六安市",
	    "341502": "金安区",
	    "341503": "裕安区",
	    "341521": "寿县",
	    "341522": "霍邱县",
	    "341523": "舒城县",
	    "341524": "金寨县",
	    "341525": "霍山县",
	    "341526": "其它区",
	    "341600": "亳州市",
	    "341602": "谯城区",
	    "341621": "涡阳县",
	    "341622": "蒙城县",
	    "341623": "利辛县",
	    "341624": "其它区",
	    "341700": "池州市",
	    "341702": "贵池区",
	    "341721": "东至县",
	    "341722": "石台县",
	    "341723": "青阳县",
	    "341724": "其它区",
	    "341800": "宣城市",
	    "341802": "宣州区",
	    "341821": "郎溪县",
	    "341822": "广德县",
	    "341823": "泾县",
	    "341824": "绩溪县",
	    "341825": "旌德县",
	    "341881": "宁国市",
	    "341882": "其它区",
	    "350000": "福建省",
	    "350100": "福州市",
	    "350102": "鼓楼区",
	    "350103": "台江区",
	    "350104": "仓山区",
	    "350105": "马尾区",
	    "350111": "晋安区",
	    "350121": "闽侯县",
	    "350122": "连江县",
	    "350123": "罗源县",
	    "350124": "闽清县",
	    "350125": "永泰县",
	    "350128": "平潭县",
	    "350181": "福清市",
	    "350182": "长乐市",
	    "350183": "其它区",
	    "350200": "厦门市",
	    "350203": "思明区",
	    "350205": "海沧区",
	    "350206": "湖里区",
	    "350211": "集美区",
	    "350212": "同安区",
	    "350213": "翔安区",
	    "350214": "其它区",
	    "350300": "莆田市",
	    "350302": "城厢区",
	    "350303": "涵江区",
	    "350304": "荔城区",
	    "350305": "秀屿区",
	    "350322": "仙游县",
	    "350323": "其它区",
	    "350400": "三明市",
	    "350402": "梅列区",
	    "350403": "三元区",
	    "350421": "明溪县",
	    "350423": "清流县",
	    "350424": "宁化县",
	    "350425": "大田县",
	    "350426": "尤溪县",
	    "350427": "沙县",
	    "350428": "将乐县",
	    "350429": "泰宁县",
	    "350430": "建宁县",
	    "350481": "永安市",
	    "350482": "其它区",
	    "350500": "泉州市",
	    "350502": "鲤城区",
	    "350503": "丰泽区",
	    "350504": "洛江区",
	    "350505": "泉港区",
	    "350521": "惠安县",
	    "350524": "安溪县",
	    "350525": "永春县",
	    "350526": "德化县",
	    "350527": "金门县",
	    "350581": "石狮市",
	    "350582": "晋江市",
	    "350583": "南安市",
	    "350584": "其它区",
	    "350600": "漳州市",
	    "350602": "芗城区",
	    "350603": "龙文区",
	    "350622": "云霄县",
	    "350623": "漳浦县",
	    "350624": "诏安县",
	    "350625": "长泰县",
	    "350626": "东山县",
	    "350627": "南靖县",
	    "350628": "平和县",
	    "350629": "华安县",
	    "350681": "龙海市",
	    "350682": "其它区",
	    "350700": "南平市",
	    "350702": "延平区",
	    "350721": "顺昌县",
	    "350722": "浦城县",
	    "350723": "光泽县",
	    "350724": "松溪县",
	    "350725": "政和县",
	    "350781": "邵武市",
	    "350782": "武夷山市",
	    "350783": "建瓯市",
	    "350784": "建阳市",
	    "350785": "其它区",
	    "350800": "龙岩市",
	    "350802": "新罗区",
	    "350821": "长汀县",
	    "350822": "永定县",
	    "350823": "上杭县",
	    "350824": "武平县",
	    "350825": "连城县",
	    "350881": "漳平市",
	    "350882": "其它区",
	    "350900": "宁德市",
	    "350902": "蕉城区",
	    "350921": "霞浦县",
	    "350922": "古田县",
	    "350923": "屏南县",
	    "350924": "寿宁县",
	    "350925": "周宁县",
	    "350926": "柘荣县",
	    "350981": "福安市",
	    "350982": "福鼎市",
	    "350983": "其它区",
	    "360000": "江西省",
	    "360100": "南昌市",
	    "360102": "东湖区",
	    "360103": "西湖区",
	    "360104": "青云谱区",
	    "360105": "湾里区",
	    "360111": "青山湖区",
	    "360121": "南昌县",
	    "360122": "新建县",
	    "360123": "安义县",
	    "360124": "进贤县",
	    "360128": "其它区",
	    "360200": "景德镇市",
	    "360202": "昌江区",
	    "360203": "珠山区",
	    "360222": "浮梁县",
	    "360281": "乐平市",
	    "360282": "其它区",
	    "360300": "萍乡市",
	    "360302": "安源区",
	    "360313": "湘东区",
	    "360321": "莲花县",
	    "360322": "上栗县",
	    "360323": "芦溪县",
	    "360324": "其它区",
	    "360400": "九江市",
	    "360402": "庐山区",
	    "360403": "浔阳区",
	    "360421": "九江县",
	    "360423": "武宁县",
	    "360424": "修水县",
	    "360425": "永修县",
	    "360426": "德安县",
	    "360427": "星子县",
	    "360428": "都昌县",
	    "360429": "湖口县",
	    "360430": "彭泽县",
	    "360481": "瑞昌市",
	    "360482": "其它区",
	    "360483": "共青城市",
	    "360500": "新余市",
	    "360502": "渝水区",
	    "360521": "分宜县",
	    "360522": "其它区",
	    "360600": "鹰潭市",
	    "360602": "月湖区",
	    "360622": "余江县",
	    "360681": "贵溪市",
	    "360682": "其它区",
	    "360700": "赣州市",
	    "360702": "章贡区",
	    "360721": "赣县",
	    "360722": "信丰县",
	    "360723": "大余县",
	    "360724": "上犹县",
	    "360725": "崇义县",
	    "360726": "安远县",
	    "360727": "龙南县",
	    "360728": "定南县",
	    "360729": "全南县",
	    "360730": "宁都县",
	    "360731": "于都县",
	    "360732": "兴国县",
	    "360733": "会昌县",
	    "360734": "寻乌县",
	    "360735": "石城县",
	    "360781": "瑞金市",
	    "360782": "南康市",
	    "360783": "其它区",
	    "360800": "吉安市",
	    "360802": "吉州区",
	    "360803": "青原区",
	    "360821": "吉安县",
	    "360822": "吉水县",
	    "360823": "峡江县",
	    "360824": "新干县",
	    "360825": "永丰县",
	    "360826": "泰和县",
	    "360827": "遂川县",
	    "360828": "万安县",
	    "360829": "安福县",
	    "360830": "永新县",
	    "360881": "井冈山市",
	    "360882": "其它区",
	    "360900": "宜春市",
	    "360902": "袁州区",
	    "360921": "奉新县",
	    "360922": "万载县",
	    "360923": "上高县",
	    "360924": "宜丰县",
	    "360925": "靖安县",
	    "360926": "铜鼓县",
	    "360981": "丰城市",
	    "360982": "樟树市",
	    "360983": "高安市",
	    "360984": "其它区",
	    "361000": "抚州市",
	    "361002": "临川区",
	    "361021": "南城县",
	    "361022": "黎川县",
	    "361023": "南丰县",
	    "361024": "崇仁县",
	    "361025": "乐安县",
	    "361026": "宜黄县",
	    "361027": "金溪县",
	    "361028": "资溪县",
	    "361029": "东乡县",
	    "361030": "广昌县",
	    "361031": "其它区",
	    "361100": "上饶市",
	    "361102": "信州区",
	    "361121": "上饶县",
	    "361122": "广丰县",
	    "361123": "玉山县",
	    "361124": "铅山县",
	    "361125": "横峰县",
	    "361126": "弋阳县",
	    "361127": "余干县",
	    "361128": "鄱阳县",
	    "361129": "万年县",
	    "361130": "婺源县",
	    "361181": "德兴市",
	    "361182": "其它区",
	    "370000": "山东省",
	    "370100": "济南市",
	    "370102": "历下区",
	    "370103": "市中区",
	    "370104": "槐荫区",
	    "370105": "天桥区",
	    "370112": "历城区",
	    "370113": "长清区",
	    "370124": "平阴县",
	    "370125": "济阳县",
	    "370126": "商河县",
	    "370181": "章丘市",
	    "370182": "其它区",
	    "370200": "青岛市",
	    "370202": "市南区",
	    "370203": "市北区",
	    "370211": "黄岛区",
	    "370212": "崂山区",
	    "370213": "李沧区",
	    "370214": "城阳区",
	    "370281": "胶州市",
	    "370282": "即墨市",
	    "370283": "平度市",
	    "370285": "莱西市",
	    "370286": "其它区",
	    "370300": "淄博市",
	    "370302": "淄川区",
	    "370303": "张店区",
	    "370304": "博山区",
	    "370305": "临淄区",
	    "370306": "周村区",
	    "370321": "桓台县",
	    "370322": "高青县",
	    "370323": "沂源县",
	    "370324": "其它区",
	    "370400": "枣庄市",
	    "370402": "市中区",
	    "370403": "薛城区",
	    "370404": "峄城区",
	    "370405": "台儿庄区",
	    "370406": "山亭区",
	    "370481": "滕州市",
	    "370482": "其它区",
	    "370500": "东营市",
	    "370502": "东营区",
	    "370503": "河口区",
	    "370521": "垦利县",
	    "370522": "利津县",
	    "370523": "广饶县",
	    "370591": "其它区",
	    "370600": "烟台市",
	    "370602": "芝罘区",
	    "370611": "福山区",
	    "370612": "牟平区",
	    "370613": "莱山区",
	    "370634": "长岛县",
	    "370681": "龙口市",
	    "370682": "莱阳市",
	    "370683": "莱州市",
	    "370684": "蓬莱市",
	    "370685": "招远市",
	    "370686": "栖霞市",
	    "370687": "海阳市",
	    "370688": "其它区",
	    "370700": "潍坊市",
	    "370702": "潍城区",
	    "370703": "寒亭区",
	    "370704": "坊子区",
	    "370705": "奎文区",
	    "370724": "临朐县",
	    "370725": "昌乐县",
	    "370781": "青州市",
	    "370782": "诸城市",
	    "370783": "寿光市",
	    "370784": "安丘市",
	    "370785": "高密市",
	    "370786": "昌邑市",
	    "370787": "其它区",
	    "370800": "济宁市",
	    "370802": "市中区",
	    "370811": "任城区",
	    "370826": "微山县",
	    "370827": "鱼台县",
	    "370828": "金乡县",
	    "370829": "嘉祥县",
	    "370830": "汶上县",
	    "370831": "泗水县",
	    "370832": "梁山县",
	    "370881": "曲阜市",
	    "370882": "兖州市",
	    "370883": "邹城市",
	    "370884": "其它区",
	    "370900": "泰安市",
	    "370902": "泰山区",
	    "370903": "岱岳区",
	    "370921": "宁阳县",
	    "370923": "东平县",
	    "370982": "新泰市",
	    "370983": "肥城市",
	    "370984": "其它区",
	    "371000": "威海市",
	    "371002": "环翠区",
	    "371081": "文登市",
	    "371082": "荣成市",
	    "371083": "乳山市",
	    "371084": "其它区",
	    "371100": "日照市",
	    "371102": "东港区",
	    "371103": "岚山区",
	    "371121": "五莲县",
	    "371122": "莒县",
	    "371123": "其它区",
	    "371200": "莱芜市",
	    "371202": "莱城区",
	    "371203": "钢城区",
	    "371204": "其它区",
	    "371300": "临沂市",
	    "371302": "兰山区",
	    "371311": "罗庄区",
	    "371312": "河东区",
	    "371321": "沂南县",
	    "371322": "郯城县",
	    "371323": "沂水县",
	    "371324": "苍山县",
	    "371325": "费县",
	    "371326": "平邑县",
	    "371327": "莒南县",
	    "371328": "蒙阴县",
	    "371329": "临沭县",
	    "371330": "其它区",
	    "371400": "德州市",
	    "371402": "德城区",
	    "371421": "陵县",
	    "371422": "宁津县",
	    "371423": "庆云县",
	    "371424": "临邑县",
	    "371425": "齐河县",
	    "371426": "平原县",
	    "371427": "夏津县",
	    "371428": "武城县",
	    "371481": "乐陵市",
	    "371482": "禹城市",
	    "371483": "其它区",
	    "371500": "聊城市",
	    "371502": "东昌府区",
	    "371521": "阳谷县",
	    "371522": "莘县",
	    "371523": "茌平县",
	    "371524": "东阿县",
	    "371525": "冠县",
	    "371526": "高唐县",
	    "371581": "临清市",
	    "371582": "其它区",
	    "371600": "滨州市",
	    "371602": "滨城区",
	    "371621": "惠民县",
	    "371622": "阳信县",
	    "371623": "无棣县",
	    "371624": "沾化县",
	    "371625": "博兴县",
	    "371626": "邹平县",
	    "371627": "其它区",
	    "371700": "菏泽市",
	    "371702": "牡丹区",
	    "371721": "曹县",
	    "371722": "单县",
	    "371723": "成武县",
	    "371724": "巨野县",
	    "371725": "郓城县",
	    "371726": "鄄城县",
	    "371727": "定陶县",
	    "371728": "东明县",
	    "371729": "其它区",
	    "410000": "河南省",
	    "410100": "郑州市",
	    "410102": "中原区",
	    "410103": "二七区",
	    "410104": "管城回族区",
	    "410105": "金水区",
	    "410106": "上街区",
	    "410108": "惠济区",
	    "410122": "中牟县",
	    "410181": "巩义市",
	    "410182": "荥阳市",
	    "410183": "新密市",
	    "410184": "新郑市",
	    "410185": "登封市",
	    "410188": "其它区",
	    "410200": "开封市",
	    "410202": "龙亭区",
	    "410203": "顺河回族区",
	    "410204": "鼓楼区",
	    "410205": "禹王台区",
	    "410211": "金明区",
	    "410221": "杞县",
	    "410222": "通许县",
	    "410223": "尉氏县",
	    "410224": "开封县",
	    "410225": "兰考县",
	    "410226": "其它区",
	    "410300": "洛阳市",
	    "410302": "老城区",
	    "410303": "西工区",
	    "410304": "瀍河回族区",
	    "410305": "涧西区",
	    "410306": "吉利区",
	    "410307": "洛龙区",
	    "410322": "孟津县",
	    "410323": "新安县",
	    "410324": "栾川县",
	    "410325": "嵩县",
	    "410326": "汝阳县",
	    "410327": "宜阳县",
	    "410328": "洛宁县",
	    "410329": "伊川县",
	    "410381": "偃师市",
	    "410400": "平顶山市",
	    "410402": "新华区",
	    "410403": "卫东区",
	    "410404": "石龙区",
	    "410411": "湛河区",
	    "410421": "宝丰县",
	    "410422": "叶县",
	    "410423": "鲁山县",
	    "410425": "郏县",
	    "410481": "舞钢市",
	    "410482": "汝州市",
	    "410483": "其它区",
	    "410500": "安阳市",
	    "410502": "文峰区",
	    "410503": "北关区",
	    "410505": "殷都区",
	    "410506": "龙安区",
	    "410522": "安阳县",
	    "410523": "汤阴县",
	    "410526": "滑县",
	    "410527": "内黄县",
	    "410581": "林州市",
	    "410582": "其它区",
	    "410600": "鹤壁市",
	    "410602": "鹤山区",
	    "410603": "山城区",
	    "410611": "淇滨区",
	    "410621": "浚县",
	    "410622": "淇县",
	    "410623": "其它区",
	    "410700": "新乡市",
	    "410702": "红旗区",
	    "410703": "卫滨区",
	    "410704": "凤泉区",
	    "410711": "牧野区",
	    "410721": "新乡县",
	    "410724": "获嘉县",
	    "410725": "原阳县",
	    "410726": "延津县",
	    "410727": "封丘县",
	    "410728": "长垣县",
	    "410781": "卫辉市",
	    "410782": "辉县市",
	    "410783": "其它区",
	    "410800": "焦作市",
	    "410802": "解放区",
	    "410803": "中站区",
	    "410804": "马村区",
	    "410811": "山阳区",
	    "410821": "修武县",
	    "410822": "博爱县",
	    "410823": "武陟县",
	    "410825": "温县",
	    "410881": "济源市",
	    "410882": "沁阳市",
	    "410883": "孟州市",
	    "410884": "其它区",
	    "410900": "濮阳市",
	    "410902": "华龙区",
	    "410922": "清丰县",
	    "410923": "南乐县",
	    "410926": "范县",
	    "410927": "台前县",
	    "410928": "濮阳县",
	    "410929": "其它区",
	    "411000": "许昌市",
	    "411002": "魏都区",
	    "411023": "许昌县",
	    "411024": "鄢陵县",
	    "411025": "襄城县",
	    "411081": "禹州市",
	    "411082": "长葛市",
	    "411083": "其它区",
	    "411100": "漯河市",
	    "411102": "源汇区",
	    "411103": "郾城区",
	    "411104": "召陵区",
	    "411121": "舞阳县",
	    "411122": "临颍县",
	    "411123": "其它区",
	    "411200": "三门峡市",
	    "411202": "湖滨区",
	    "411221": "渑池县",
	    "411222": "陕县",
	    "411224": "卢氏县",
	    "411281": "义马市",
	    "411282": "灵宝市",
	    "411283": "其它区",
	    "411300": "南阳市",
	    "411302": "宛城区",
	    "411303": "卧龙区",
	    "411321": "南召县",
	    "411322": "方城县",
	    "411323": "西峡县",
	    "411324": "镇平县",
	    "411325": "内乡县",
	    "411326": "淅川县",
	    "411327": "社旗县",
	    "411328": "唐河县",
	    "411329": "新野县",
	    "411330": "桐柏县",
	    "411381": "邓州市",
	    "411382": "其它区",
	    "411400": "商丘市",
	    "411402": "梁园区",
	    "411403": "睢阳区",
	    "411421": "民权县",
	    "411422": "睢县",
	    "411423": "宁陵县",
	    "411424": "柘城县",
	    "411425": "虞城县",
	    "411426": "夏邑县",
	    "411481": "永城市",
	    "411482": "其它区",
	    "411500": "信阳市",
	    "411502": "浉河区",
	    "411503": "平桥区",
	    "411521": "罗山县",
	    "411522": "光山县",
	    "411523": "新县",
	    "411524": "商城县",
	    "411525": "固始县",
	    "411526": "潢川县",
	    "411527": "淮滨县",
	    "411528": "息县",
	    "411529": "其它区",
	    "411600": "周口市",
	    "411602": "川汇区",
	    "411621": "扶沟县",
	    "411622": "西华县",
	    "411623": "商水县",
	    "411624": "沈丘县",
	    "411625": "郸城县",
	    "411626": "淮阳县",
	    "411627": "太康县",
	    "411628": "鹿邑县",
	    "411681": "项城市",
	    "411682": "其它区",
	    "411700": "驻马店市",
	    "411702": "驿城区",
	    "411721": "西平县",
	    "411722": "上蔡县",
	    "411723": "平舆县",
	    "411724": "正阳县",
	    "411725": "确山县",
	    "411726": "泌阳县",
	    "411727": "汝南县",
	    "411728": "遂平县",
	    "411729": "新蔡县",
	    "411730": "其它区",
	    "420000": "湖北省",
	    "420100": "武汉市",
	    "420102": "江岸区",
	    "420103": "江汉区",
	    "420104": "硚口区",
	    "420105": "汉阳区",
	    "420106": "武昌区",
	    "420107": "青山区",
	    "420111": "洪山区",
	    "420112": "东西湖区",
	    "420113": "汉南区",
	    "420114": "蔡甸区",
	    "420115": "江夏区",
	    "420116": "黄陂区",
	    "420117": "新洲区",
	    "420118": "其它区",
	    "420200": "黄石市",
	    "420202": "黄石港区",
	    "420203": "西塞山区",
	    "420204": "下陆区",
	    "420205": "铁山区",
	    "420222": "阳新县",
	    "420281": "大冶市",
	    "420282": "其它区",
	    "420300": "十堰市",
	    "420302": "茅箭区",
	    "420303": "张湾区",
	    "420321": "郧县",
	    "420322": "郧西县",
	    "420323": "竹山县",
	    "420324": "竹溪县",
	    "420325": "房县",
	    "420381": "丹江口市",
	    "420383": "其它区",
	    "420500": "宜昌市",
	    "420502": "西陵区",
	    "420503": "伍家岗区",
	    "420504": "点军区",
	    "420505": "猇亭区",
	    "420506": "夷陵区",
	    "420525": "远安县",
	    "420526": "兴山县",
	    "420527": "秭归县",
	    "420528": "长阳土家族自治县",
	    "420529": "五峰土家族自治县",
	    "420581": "宜都市",
	    "420582": "当阳市",
	    "420583": "枝江市",
	    "420584": "其它区",
	    "420600": "襄阳市",
	    "420602": "襄城区",
	    "420606": "樊城区",
	    "420607": "襄州区",
	    "420624": "南漳县",
	    "420625": "谷城县",
	    "420626": "保康县",
	    "420682": "老河口市",
	    "420683": "枣阳市",
	    "420684": "宜城市",
	    "420685": "其它区",
	    "420700": "鄂州市",
	    "420702": "梁子湖区",
	    "420703": "华容区",
	    "420704": "鄂城区",
	    "420705": "其它区",
	    "420800": "荆门市",
	    "420802": "东宝区",
	    "420804": "掇刀区",
	    "420821": "京山县",
	    "420822": "沙洋县",
	    "420881": "钟祥市",
	    "420882": "其它区",
	    "420900": "孝感市",
	    "420902": "孝南区",
	    "420921": "孝昌县",
	    "420922": "大悟县",
	    "420923": "云梦县",
	    "420981": "应城市",
	    "420982": "安陆市",
	    "420984": "汉川市",
	    "420985": "其它区",
	    "421000": "荆州市",
	    "421002": "沙市区",
	    "421003": "荆州区",
	    "421022": "公安县",
	    "421023": "监利县",
	    "421024": "江陵县",
	    "421081": "石首市",
	    "421083": "洪湖市",
	    "421087": "松滋市",
	    "421088": "其它区",
	    "421100": "黄冈市",
	    "421102": "黄州区",
	    "421121": "团风县",
	    "421122": "红安县",
	    "421123": "罗田县",
	    "421124": "英山县",
	    "421125": "浠水县",
	    "421126": "蕲春县",
	    "421127": "黄梅县",
	    "421181": "麻城市",
	    "421182": "武穴市",
	    "421183": "其它区",
	    "421200": "咸宁市",
	    "421202": "咸安区",
	    "421221": "嘉鱼县",
	    "421222": "通城县",
	    "421223": "崇阳县",
	    "421224": "通山县",
	    "421281": "赤壁市",
	    "421283": "其它区",
	    "421300": "随州市",
	    "421302": "曾都区",
	    "421321": "随县",
	    "421381": "广水市",
	    "421382": "其它区",
	    "422800": "恩施土家族苗族自治州",
	    "422801": "恩施市",
	    "422802": "利川市",
	    "422822": "建始县",
	    "422823": "巴东县",
	    "422825": "宣恩县",
	    "422826": "咸丰县",
	    "422827": "来凤县",
	    "422828": "鹤峰县",
	    "422829": "其它区",
	    "429004": "仙桃市",
	    "429005": "潜江市",
	    "429006": "天门市",
	    "429021": "神农架林区",
	    "430000": "湖南省",
	    "430100": "长沙市",
	    "430102": "芙蓉区",
	    "430103": "天心区",
	    "430104": "岳麓区",
	    "430105": "开福区",
	    "430111": "雨花区",
	    "430121": "长沙县",
	    "430122": "望城区",
	    "430124": "宁乡县",
	    "430181": "浏阳市",
	    "430182": "其它区",
	    "430200": "株洲市",
	    "430202": "荷塘区",
	    "430203": "芦淞区",
	    "430204": "石峰区",
	    "430211": "天元区",
	    "430221": "株洲县",
	    "430223": "攸县",
	    "430224": "茶陵县",
	    "430225": "炎陵县",
	    "430281": "醴陵市",
	    "430282": "其它区",
	    "430300": "湘潭市",
	    "430302": "雨湖区",
	    "430304": "岳塘区",
	    "430321": "湘潭县",
	    "430381": "湘乡市",
	    "430382": "韶山市",
	    "430383": "其它区",
	    "430400": "衡阳市",
	    "430405": "珠晖区",
	    "430406": "雁峰区",
	    "430407": "石鼓区",
	    "430408": "蒸湘区",
	    "430412": "南岳区",
	    "430421": "衡阳县",
	    "430422": "衡南县",
	    "430423": "衡山县",
	    "430424": "衡东县",
	    "430426": "祁东县",
	    "430481": "耒阳市",
	    "430482": "常宁市",
	    "430483": "其它区",
	    "430500": "邵阳市",
	    "430502": "双清区",
	    "430503": "大祥区",
	    "430511": "北塔区",
	    "430521": "邵东县",
	    "430522": "新邵县",
	    "430523": "邵阳县",
	    "430524": "隆回县",
	    "430525": "洞口县",
	    "430527": "绥宁县",
	    "430528": "新宁县",
	    "430529": "城步苗族自治县",
	    "430581": "武冈市",
	    "430582": "其它区",
	    "430600": "岳阳市",
	    "430602": "岳阳楼区",
	    "430603": "云溪区",
	    "430611": "君山区",
	    "430621": "岳阳县",
	    "430623": "华容县",
	    "430624": "湘阴县",
	    "430626": "平江县",
	    "430681": "汨罗市",
	    "430682": "临湘市",
	    "430683": "其它区",
	    "430700": "常德市",
	    "430702": "武陵区",
	    "430703": "鼎城区",
	    "430721": "安乡县",
	    "430722": "汉寿县",
	    "430723": "澧县",
	    "430724": "临澧县",
	    "430725": "桃源县",
	    "430726": "石门县",
	    "430781": "津市市",
	    "430782": "其它区",
	    "430800": "张家界市",
	    "430802": "永定区",
	    "430811": "武陵源区",
	    "430821": "慈利县",
	    "430822": "桑植县",
	    "430823": "其它区",
	    "430900": "益阳市",
	    "430902": "资阳区",
	    "430903": "赫山区",
	    "430921": "南县",
	    "430922": "桃江县",
	    "430923": "安化县",
	    "430981": "沅江市",
	    "430982": "其它区",
	    "431000": "郴州市",
	    "431002": "北湖区",
	    "431003": "苏仙区",
	    "431021": "桂阳县",
	    "431022": "宜章县",
	    "431023": "永兴县",
	    "431024": "嘉禾县",
	    "431025": "临武县",
	    "431026": "汝城县",
	    "431027": "桂东县",
	    "431028": "安仁县",
	    "431081": "资兴市",
	    "431082": "其它区",
	    "431100": "永州市",
	    "431102": "零陵区",
	    "431103": "冷水滩区",
	    "431121": "祁阳县",
	    "431122": "东安县",
	    "431123": "双牌县",
	    "431124": "道县",
	    "431125": "江永县",
	    "431126": "宁远县",
	    "431127": "蓝山县",
	    "431128": "新田县",
	    "431129": "江华瑶族自治县",
	    "431130": "其它区",
	    "431200": "怀化市",
	    "431202": "鹤城区",
	    "431221": "中方县",
	    "431222": "沅陵县",
	    "431223": "辰溪县",
	    "431224": "溆浦县",
	    "431225": "会同县",
	    "431226": "麻阳苗族自治县",
	    "431227": "新晃侗族自治县",
	    "431228": "芷江侗族自治县",
	    "431229": "靖州苗族侗族自治县",
	    "431230": "通道侗族自治县",
	    "431281": "洪江市",
	    "431282": "其它区",
	    "431300": "娄底市",
	    "431302": "娄星区",
	    "431321": "双峰县",
	    "431322": "新化县",
	    "431381": "冷水江市",
	    "431382": "涟源市",
	    "431383": "其它区",
	    "433100": "湘西土家族苗族自治州",
	    "433101": "吉首市",
	    "433122": "泸溪县",
	    "433123": "凤凰县",
	    "433124": "花垣县",
	    "433125": "保靖县",
	    "433126": "古丈县",
	    "433127": "永顺县",
	    "433130": "龙山县",
	    "433131": "其它区",
	    "440000": "广东省",
	    "440100": "广州市",
	    "440103": "荔湾区",
	    "440104": "越秀区",
	    "440105": "海珠区",
	    "440106": "天河区",
	    "440111": "白云区",
	    "440112": "黄埔区",
	    "440113": "番禺区",
	    "440114": "花都区",
	    "440115": "南沙区",
	    "440116": "萝岗区",
	    "440183": "增城市",
	    "440184": "从化市",
	    "440189": "其它区",
	    "440200": "韶关市",
	    "440203": "武江区",
	    "440204": "浈江区",
	    "440205": "曲江区",
	    "440222": "始兴县",
	    "440224": "仁化县",
	    "440229": "翁源县",
	    "440232": "乳源瑶族自治县",
	    "440233": "新丰县",
	    "440281": "乐昌市",
	    "440282": "南雄市",
	    "440283": "其它区",
	    "440300": "深圳市",
	    "440303": "罗湖区",
	    "440304": "福田区",
	    "440305": "南山区",
	    "440306": "宝安区",
	    "440307": "龙岗区",
	    "440308": "盐田区",
	    "440309": "其它区",
	    "440320": "光明新区",
	    "440321": "坪山新区",
	    "440322": "大鹏新区",
	    "440323": "龙华新区",
	    "440400": "珠海市",
	    "440402": "香洲区",
	    "440403": "斗门区",
	    "440404": "金湾区",
	    "440488": "其它区",
	    "440500": "汕头市",
	    "440507": "龙湖区",
	    "440511": "金平区",
	    "440512": "濠江区",
	    "440513": "潮阳区",
	    "440514": "潮南区",
	    "440515": "澄海区",
	    "440523": "南澳县",
	    "440524": "其它区",
	    "440600": "佛山市",
	    "440604": "禅城区",
	    "440605": "南海区",
	    "440606": "顺德区",
	    "440607": "三水区",
	    "440608": "高明区",
	    "440609": "其它区",
	    "440700": "江门市",
	    "440703": "蓬江区",
	    "440704": "江海区",
	    "440705": "新会区",
	    "440781": "台山市",
	    "440783": "开平市",
	    "440784": "鹤山市",
	    "440785": "恩平市",
	    "440786": "其它区",
	    "440800": "湛江市",
	    "440802": "赤坎区",
	    "440803": "霞山区",
	    "440804": "坡头区",
	    "440811": "麻章区",
	    "440823": "遂溪县",
	    "440825": "徐闻县",
	    "440881": "廉江市",
	    "440882": "雷州市",
	    "440883": "吴川市",
	    "440884": "其它区",
	    "440900": "茂名市",
	    "440902": "茂南区",
	    "440903": "茂港区",
	    "440923": "电白县",
	    "440981": "高州市",
	    "440982": "化州市",
	    "440983": "信宜市",
	    "440984": "其它区",
	    "441200": "肇庆市",
	    "441202": "端州区",
	    "441203": "鼎湖区",
	    "441223": "广宁县",
	    "441224": "怀集县",
	    "441225": "封开县",
	    "441226": "德庆县",
	    "441283": "高要市",
	    "441284": "四会市",
	    "441285": "其它区",
	    "441300": "惠州市",
	    "441302": "惠城区",
	    "441303": "惠阳区",
	    "441322": "博罗县",
	    "441323": "惠东县",
	    "441324": "龙门县",
	    "441325": "其它区",
	    "441400": "梅州市",
	    "441402": "梅江区",
	    "441421": "梅县",
	    "441422": "大埔县",
	    "441423": "丰顺县",
	    "441424": "五华县",
	    "441426": "平远县",
	    "441427": "蕉岭县",
	    "441481": "兴宁市",
	    "441482": "其它区",
	    "441500": "汕尾市",
	    "441502": "城区",
	    "441521": "海丰县",
	    "441523": "陆河县",
	    "441581": "陆丰市",
	    "441582": "其它区",
	    "441600": "河源市",
	    "441602": "源城区",
	    "441621": "紫金县",
	    "441622": "龙川县",
	    "441623": "连平县",
	    "441624": "和平县",
	    "441625": "东源县",
	    "441626": "其它区",
	    "441700": "阳江市",
	    "441702": "江城区",
	    "441721": "阳西县",
	    "441723": "阳东县",
	    "441781": "阳春市",
	    "441782": "其它区",
	    "441800": "清远市",
	    "441802": "清城区",
	    "441821": "佛冈县",
	    "441823": "阳山县",
	    "441825": "连山壮族瑶族自治县",
	    "441826": "连南瑶族自治县",
	    "441827": "清新区",
	    "441881": "英德市",
	    "441882": "连州市",
	    "441883": "其它区",
	    "441900": "东莞市",
	    "442000": "中山市",
	    "442101": "东沙群岛",
	    "445100": "潮州市",
	    "445102": "湘桥区",
	    "445121": "潮安区",
	    "445122": "饶平县",
	    "445186": "其它区",
	    "445200": "揭阳市",
	    "445202": "榕城区",
	    "445221": "揭东区",
	    "445222": "揭西县",
	    "445224": "惠来县",
	    "445281": "普宁市",
	    "445285": "其它区",
	    "445300": "云浮市",
	    "445302": "云城区",
	    "445321": "新兴县",
	    "445322": "郁南县",
	    "445323": "云安县",
	    "445381": "罗定市",
	    "445382": "其它区",
	    "450000": "广西壮族自治区",
	    "450100": "南宁市",
	    "450102": "兴宁区",
	    "450103": "青秀区",
	    "450105": "江南区",
	    "450107": "西乡塘区",
	    "450108": "良庆区",
	    "450109": "邕宁区",
	    "450122": "武鸣县",
	    "450123": "隆安县",
	    "450124": "马山县",
	    "450125": "上林县",
	    "450126": "宾阳县",
	    "450127": "横县",
	    "450128": "其它区",
	    "450200": "柳州市",
	    "450202": "城中区",
	    "450203": "鱼峰区",
	    "450204": "柳南区",
	    "450205": "柳北区",
	    "450221": "柳江县",
	    "450222": "柳城县",
	    "450223": "鹿寨县",
	    "450224": "融安县",
	    "450225": "融水苗族自治县",
	    "450226": "三江侗族自治县",
	    "450227": "其它区",
	    "450300": "桂林市",
	    "450302": "秀峰区",
	    "450303": "叠彩区",
	    "450304": "象山区",
	    "450305": "七星区",
	    "450311": "雁山区",
	    "450321": "阳朔县",
	    "450322": "临桂区",
	    "450323": "灵川县",
	    "450324": "全州县",
	    "450325": "兴安县",
	    "450326": "永福县",
	    "450327": "灌阳县",
	    "450328": "龙胜各族自治县",
	    "450329": "资源县",
	    "450330": "平乐县",
	    "450331": "荔浦县",
	    "450332": "恭城瑶族自治县",
	    "450333": "其它区",
	    "450400": "梧州市",
	    "450403": "万秀区",
	    "450405": "长洲区",
	    "450406": "龙圩区",
	    "450421": "苍梧县",
	    "450422": "藤县",
	    "450423": "蒙山县",
	    "450481": "岑溪市",
	    "450482": "其它区",
	    "450500": "北海市",
	    "450502": "海城区",
	    "450503": "银海区",
	    "450512": "铁山港区",
	    "450521": "合浦县",
	    "450522": "其它区",
	    "450600": "防城港市",
	    "450602": "港口区",
	    "450603": "防城区",
	    "450621": "上思县",
	    "450681": "东兴市",
	    "450682": "其它区",
	    "450700": "钦州市",
	    "450702": "钦南区",
	    "450703": "钦北区",
	    "450721": "灵山县",
	    "450722": "浦北县",
	    "450723": "其它区",
	    "450800": "贵港市",
	    "450802": "港北区",
	    "450803": "港南区",
	    "450804": "覃塘区",
	    "450821": "平南县",
	    "450881": "桂平市",
	    "450882": "其它区",
	    "450900": "玉林市",
	    "450902": "玉州区",
	    "450903": "福绵区",
	    "450921": "容县",
	    "450922": "陆川县",
	    "450923": "博白县",
	    "450924": "兴业县",
	    "450981": "北流市",
	    "450982": "其它区",
	    "451000": "百色市",
	    "451002": "右江区",
	    "451021": "田阳县",
	    "451022": "田东县",
	    "451023": "平果县",
	    "451024": "德保县",
	    "451025": "靖西县",
	    "451026": "那坡县",
	    "451027": "凌云县",
	    "451028": "乐业县",
	    "451029": "田林县",
	    "451030": "西林县",
	    "451031": "隆林各族自治县",
	    "451032": "其它区",
	    "451100": "贺州市",
	    "451102": "八步区",
	    "451119": "平桂管理区",
	    "451121": "昭平县",
	    "451122": "钟山县",
	    "451123": "富川瑶族自治县",
	    "451124": "其它区",
	    "451200": "河池市",
	    "451202": "金城江区",
	    "451221": "南丹县",
	    "451222": "天峨县",
	    "451223": "凤山县",
	    "451224": "东兰县",
	    "451225": "罗城仫佬族自治县",
	    "451226": "环江毛南族自治县",
	    "451227": "巴马瑶族自治县",
	    "451228": "都安瑶族自治县",
	    "451229": "大化瑶族自治县",
	    "451281": "宜州市",
	    "451282": "其它区",
	    "451300": "来宾市",
	    "451302": "兴宾区",
	    "451321": "忻城县",
	    "451322": "象州县",
	    "451323": "武宣县",
	    "451324": "金秀瑶族自治县",
	    "451381": "合山市",
	    "451382": "其它区",
	    "451400": "崇左市",
	    "451402": "江州区",
	    "451421": "扶绥县",
	    "451422": "宁明县",
	    "451423": "龙州县",
	    "451424": "大新县",
	    "451425": "天等县",
	    "451481": "凭祥市",
	    "451482": "其它区",
	    "460000": "海南省",
	    "460100": "海口市",
	    "460105": "秀英区",
	    "460106": "龙华区",
	    "460107": "琼山区",
	    "460108": "美兰区",
	    "460109": "其它区",
	    "460200": "三亚市",
	    "460300": "三沙市",
	    "460321": "西沙群岛",
	    "460322": "南沙群岛",
	    "460323": "中沙群岛的岛礁及其海域",
	    "469001": "五指山市",
	    "469002": "琼海市",
	    "469003": "儋州市",
	    "469005": "文昌市",
	    "469006": "万宁市",
	    "469007": "东方市",
	    "469025": "定安县",
	    "469026": "屯昌县",
	    "469027": "澄迈县",
	    "469028": "临高县",
	    "469030": "白沙黎族自治县",
	    "469031": "昌江黎族自治县",
	    "469033": "乐东黎族自治县",
	    "469034": "陵水黎族自治县",
	    "469035": "保亭黎族苗族自治县",
	    "469036": "琼中黎族苗族自治县",
	    "471005": "其它区",
	    "500000": "重庆",
	    "500100": "重庆市",
	    "500101": "万州区",
	    "500102": "涪陵区",
	    "500103": "渝中区",
	    "500104": "大渡口区",
	    "500105": "江北区",
	    "500106": "沙坪坝区",
	    "500107": "九龙坡区",
	    "500108": "南岸区",
	    "500109": "北碚区",
	    "500110": "万盛区",
	    "500111": "双桥区",
	    "500112": "渝北区",
	    "500113": "巴南区",
	    "500114": "黔江区",
	    "500115": "长寿区",
	    "500222": "綦江区",
	    "500223": "潼南县",
	    "500224": "铜梁县",
	    "500225": "大足区",
	    "500226": "荣昌县",
	    "500227": "璧山县",
	    "500228": "梁平县",
	    "500229": "城口县",
	    "500230": "丰都县",
	    "500231": "垫江县",
	    "500232": "武隆县",
	    "500233": "忠县",
	    "500234": "开县",
	    "500235": "云阳县",
	    "500236": "奉节县",
	    "500237": "巫山县",
	    "500238": "巫溪县",
	    "500240": "石柱土家族自治县",
	    "500241": "秀山土家族苗族自治县",
	    "500242": "酉阳土家族苗族自治县",
	    "500243": "彭水苗族土家族自治县",
	    "500381": "江津区",
	    "500382": "合川区",
	    "500383": "永川区",
	    "500384": "南川区",
	    "500385": "其它区",
	    "510000": "四川省",
	    "510100": "成都市",
	    "510104": "锦江区",
	    "510105": "青羊区",
	    "510106": "金牛区",
	    "510107": "武侯区",
	    "510108": "成华区",
	    "510112": "龙泉驿区",
	    "510113": "青白江区",
	    "510114": "新都区",
	    "510115": "温江区",
	    "510121": "金堂县",
	    "510122": "双流县",
	    "510124": "郫县",
	    "510129": "大邑县",
	    "510131": "蒲江县",
	    "510132": "新津县",
	    "510181": "都江堰市",
	    "510182": "彭州市",
	    "510183": "邛崃市",
	    "510184": "崇州市",
	    "510185": "其它区",
	    "510300": "自贡市",
	    "510302": "自流井区",
	    "510303": "贡井区",
	    "510304": "大安区",
	    "510311": "沿滩区",
	    "510321": "荣县",
	    "510322": "富顺县",
	    "510323": "其它区",
	    "510400": "攀枝花市",
	    "510402": "东区",
	    "510403": "西区",
	    "510411": "仁和区",
	    "510421": "米易县",
	    "510422": "盐边县",
	    "510423": "其它区",
	    "510500": "泸州市",
	    "510502": "江阳区",
	    "510503": "纳溪区",
	    "510504": "龙马潭区",
	    "510521": "泸县",
	    "510522": "合江县",
	    "510524": "叙永县",
	    "510525": "古蔺县",
	    "510526": "其它区",
	    "510600": "德阳市",
	    "510603": "旌阳区",
	    "510623": "中江县",
	    "510626": "罗江县",
	    "510681": "广汉市",
	    "510682": "什邡市",
	    "510683": "绵竹市",
	    "510684": "其它区",
	    "510700": "绵阳市",
	    "510703": "涪城区",
	    "510704": "游仙区",
	    "510722": "三台县",
	    "510723": "盐亭县",
	    "510724": "安县",
	    "510725": "梓潼县",
	    "510726": "北川羌族自治县",
	    "510727": "平武县",
	    "510781": "江油市",
	    "510782": "其它区",
	    "510800": "广元市",
	    "510802": "利州区",
	    "510811": "昭化区",
	    "510812": "朝天区",
	    "510821": "旺苍县",
	    "510822": "青川县",
	    "510823": "剑阁县",
	    "510824": "苍溪县",
	    "510825": "其它区",
	    "510900": "遂宁市",
	    "510903": "船山区",
	    "510904": "安居区",
	    "510921": "蓬溪县",
	    "510922": "射洪县",
	    "510923": "大英县",
	    "510924": "其它区",
	    "511000": "内江市",
	    "511002": "市中区",
	    "511011": "东兴区",
	    "511024": "威远县",
	    "511025": "资中县",
	    "511028": "隆昌县",
	    "511029": "其它区",
	    "511100": "乐山市",
	    "511102": "市中区",
	    "511111": "沙湾区",
	    "511112": "五通桥区",
	    "511113": "金口河区",
	    "511123": "犍为县",
	    "511124": "井研县",
	    "511126": "夹江县",
	    "511129": "沐川县",
	    "511132": "峨边彝族自治县",
	    "511133": "马边彝族自治县",
	    "511181": "峨眉山市",
	    "511182": "其它区",
	    "511300": "南充市",
	    "511302": "顺庆区",
	    "511303": "高坪区",
	    "511304": "嘉陵区",
	    "511321": "南部县",
	    "511322": "营山县",
	    "511323": "蓬安县",
	    "511324": "仪陇县",
	    "511325": "西充县",
	    "511381": "阆中市",
	    "511382": "其它区",
	    "511400": "眉山市",
	    "511402": "东坡区",
	    "511421": "仁寿县",
	    "511422": "彭山县",
	    "511423": "洪雅县",
	    "511424": "丹棱县",
	    "511425": "青神县",
	    "511426": "其它区",
	    "511500": "宜宾市",
	    "511502": "翠屏区",
	    "511521": "宜宾县",
	    "511522": "南溪区",
	    "511523": "江安县",
	    "511524": "长宁县",
	    "511525": "高县",
	    "511526": "珙县",
	    "511527": "筠连县",
	    "511528": "兴文县",
	    "511529": "屏山县",
	    "511530": "其它区",
	    "511600": "广安市",
	    "511602": "广安区",
	    "511603": "前锋区",
	    "511621": "岳池县",
	    "511622": "武胜县",
	    "511623": "邻水县",
	    "511681": "华蓥市",
	    "511683": "其它区",
	    "511700": "达州市",
	    "511702": "通川区",
	    "511721": "达川区",
	    "511722": "宣汉县",
	    "511723": "开江县",
	    "511724": "大竹县",
	    "511725": "渠县",
	    "511781": "万源市",
	    "511782": "其它区",
	    "511800": "雅安市",
	    "511802": "雨城区",
	    "511821": "名山区",
	    "511822": "荥经县",
	    "511823": "汉源县",
	    "511824": "石棉县",
	    "511825": "天全县",
	    "511826": "芦山县",
	    "511827": "宝兴县",
	    "511828": "其它区",
	    "511900": "巴中市",
	    "511902": "巴州区",
	    "511903": "恩阳区",
	    "511921": "通江县",
	    "511922": "南江县",
	    "511923": "平昌县",
	    "511924": "其它区",
	    "512000": "资阳市",
	    "512002": "雁江区",
	    "512021": "安岳县",
	    "512022": "乐至县",
	    "512081": "简阳市",
	    "512082": "其它区",
	    "513200": "阿坝藏族羌族自治州",
	    "513221": "汶川县",
	    "513222": "理县",
	    "513223": "茂县",
	    "513224": "松潘县",
	    "513225": "九寨沟县",
	    "513226": "金川县",
	    "513227": "小金县",
	    "513228": "黑水县",
	    "513229": "马尔康县",
	    "513230": "壤塘县",
	    "513231": "阿坝县",
	    "513232": "若尔盖县",
	    "513233": "红原县",
	    "513234": "其它区",
	    "513300": "甘孜藏族自治州",
	    "513321": "康定县",
	    "513322": "泸定县",
	    "513323": "丹巴县",
	    "513324": "九龙县",
	    "513325": "雅江县",
	    "513326": "道孚县",
	    "513327": "炉霍县",
	    "513328": "甘孜县",
	    "513329": "新龙县",
	    "513330": "德格县",
	    "513331": "白玉县",
	    "513332": "石渠县",
	    "513333": "色达县",
	    "513334": "理塘县",
	    "513335": "巴塘县",
	    "513336": "乡城县",
	    "513337": "稻城县",
	    "513338": "得荣县",
	    "513339": "其它区",
	    "513400": "凉山彝族自治州",
	    "513401": "西昌市",
	    "513422": "木里藏族自治县",
	    "513423": "盐源县",
	    "513424": "德昌县",
	    "513425": "会理县",
	    "513426": "会东县",
	    "513427": "宁南县",
	    "513428": "普格县",
	    "513429": "布拖县",
	    "513430": "金阳县",
	    "513431": "昭觉县",
	    "513432": "喜德县",
	    "513433": "冕宁县",
	    "513434": "越西县",
	    "513435": "甘洛县",
	    "513436": "美姑县",
	    "513437": "雷波县",
	    "513438": "其它区",
	    "520000": "贵州省",
	    "520100": "贵阳市",
	    "520102": "南明区",
	    "520103": "云岩区",
	    "520111": "花溪区",
	    "520112": "乌当区",
	    "520113": "白云区",
	    "520121": "开阳县",
	    "520122": "息烽县",
	    "520123": "修文县",
	    "520151": "观山湖区",
	    "520181": "清镇市",
	    "520182": "其它区",
	    "520200": "六盘水市",
	    "520201": "钟山区",
	    "520203": "六枝特区",
	    "520221": "水城县",
	    "520222": "盘县",
	    "520223": "其它区",
	    "520300": "遵义市",
	    "520302": "红花岗区",
	    "520303": "汇川区",
	    "520321": "遵义县",
	    "520322": "桐梓县",
	    "520323": "绥阳县",
	    "520324": "正安县",
	    "520325": "道真仡佬族苗族自治县",
	    "520326": "务川仡佬族苗族自治县",
	    "520327": "凤冈县",
	    "520328": "湄潭县",
	    "520329": "余庆县",
	    "520330": "习水县",
	    "520381": "赤水市",
	    "520382": "仁怀市",
	    "520383": "其它区",
	    "520400": "安顺市",
	    "520402": "西秀区",
	    "520421": "平坝县",
	    "520422": "普定县",
	    "520423": "镇宁布依族苗族自治县",
	    "520424": "关岭布依族苗族自治县",
	    "520425": "紫云苗族布依族自治县",
	    "520426": "其它区",
	    "522200": "铜仁市",
	    "522201": "碧江区",
	    "522222": "江口县",
	    "522223": "玉屏侗族自治县",
	    "522224": "石阡县",
	    "522225": "思南县",
	    "522226": "印江土家族苗族自治县",
	    "522227": "德江县",
	    "522228": "沿河土家族自治县",
	    "522229": "松桃苗族自治县",
	    "522230": "万山区",
	    "522231": "其它区",
	    "522300": "黔西南布依族苗族自治州",
	    "522301": "兴义市",
	    "522322": "兴仁县",
	    "522323": "普安县",
	    "522324": "晴隆县",
	    "522325": "贞丰县",
	    "522326": "望谟县",
	    "522327": "册亨县",
	    "522328": "安龙县",
	    "522329": "其它区",
	    "522400": "毕节市",
	    "522401": "七星关区",
	    "522422": "大方县",
	    "522423": "黔西县",
	    "522424": "金沙县",
	    "522425": "织金县",
	    "522426": "纳雍县",
	    "522427": "威宁彝族回族苗族自治县",
	    "522428": "赫章县",
	    "522429": "其它区",
	    "522600": "黔东南苗族侗族自治州",
	    "522601": "凯里市",
	    "522622": "黄平县",
	    "522623": "施秉县",
	    "522624": "三穗县",
	    "522625": "镇远县",
	    "522626": "岑巩县",
	    "522627": "天柱县",
	    "522628": "锦屏县",
	    "522629": "剑河县",
	    "522630": "台江县",
	    "522631": "黎平县",
	    "522632": "榕江县",
	    "522633": "从江县",
	    "522634": "雷山县",
	    "522635": "麻江县",
	    "522636": "丹寨县",
	    "522637": "其它区",
	    "522700": "黔南布依族苗族自治州",
	    "522701": "都匀市",
	    "522702": "福泉市",
	    "522722": "荔波县",
	    "522723": "贵定县",
	    "522725": "瓮安县",
	    "522726": "独山县",
	    "522727": "平塘县",
	    "522728": "罗甸县",
	    "522729": "长顺县",
	    "522730": "龙里县",
	    "522731": "惠水县",
	    "522732": "三都水族自治县",
	    "522733": "其它区",
	    "530000": "云南省",
	    "530100": "昆明市",
	    "530102": "五华区",
	    "530103": "盘龙区",
	    "530111": "官渡区",
	    "530112": "西山区",
	    "530113": "东川区",
	    "530121": "呈贡区",
	    "530122": "晋宁县",
	    "530124": "富民县",
	    "530125": "宜良县",
	    "530126": "石林彝族自治县",
	    "530127": "嵩明县",
	    "530128": "禄劝彝族苗族自治县",
	    "530129": "寻甸回族彝族自治县",
	    "530181": "安宁市",
	    "530182": "其它区",
	    "530300": "曲靖市",
	    "530302": "麒麟区",
	    "530321": "马龙县",
	    "530322": "陆良县",
	    "530323": "师宗县",
	    "530324": "罗平县",
	    "530325": "富源县",
	    "530326": "会泽县",
	    "530328": "沾益县",
	    "530381": "宣威市",
	    "530382": "其它区",
	    "530400": "玉溪市",
	    "530402": "红塔区",
	    "530421": "江川县",
	    "530422": "澄江县",
	    "530423": "通海县",
	    "530424": "华宁县",
	    "530425": "易门县",
	    "530426": "峨山彝族自治县",
	    "530427": "新平彝族傣族自治县",
	    "530428": "元江哈尼族彝族傣族自治县",
	    "530429": "其它区",
	    "530500": "保山市",
	    "530502": "隆阳区",
	    "530521": "施甸县",
	    "530522": "腾冲县",
	    "530523": "龙陵县",
	    "530524": "昌宁县",
	    "530525": "其它区",
	    "530600": "昭通市",
	    "530602": "昭阳区",
	    "530621": "鲁甸县",
	    "530622": "巧家县",
	    "530623": "盐津县",
	    "530624": "大关县",
	    "530625": "永善县",
	    "530626": "绥江县",
	    "530627": "镇雄县",
	    "530628": "彝良县",
	    "530629": "威信县",
	    "530630": "水富县",
	    "530631": "其它区",
	    "530700": "丽江市",
	    "530702": "古城区",
	    "530721": "玉龙纳西族自治县",
	    "530722": "永胜县",
	    "530723": "华坪县",
	    "530724": "宁蒗彝族自治县",
	    "530725": "其它区",
	    "530800": "普洱市",
	    "530802": "思茅区",
	    "530821": "宁洱哈尼族彝族自治县",
	    "530822": "墨江哈尼族自治县",
	    "530823": "景东彝族自治县",
	    "530824": "景谷傣族彝族自治县",
	    "530825": "镇沅彝族哈尼族拉祜族自治县",
	    "530826": "江城哈尼族彝族自治县",
	    "530827": "孟连傣族拉祜族佤族自治县",
	    "530828": "澜沧拉祜族自治县",
	    "530829": "西盟佤族自治县",
	    "530830": "其它区",
	    "530900": "临沧市",
	    "530902": "临翔区",
	    "530921": "凤庆县",
	    "530922": "云县",
	    "530923": "永德县",
	    "530924": "镇康县",
	    "530925": "双江拉祜族佤族布朗族傣族自治县",
	    "530926": "耿马傣族佤族自治县",
	    "530927": "沧源佤族自治县",
	    "530928": "其它区",
	    "532300": "楚雄彝族自治州",
	    "532301": "楚雄市",
	    "532322": "双柏县",
	    "532323": "牟定县",
	    "532324": "南华县",
	    "532325": "姚安县",
	    "532326": "大姚县",
	    "532327": "永仁县",
	    "532328": "元谋县",
	    "532329": "武定县",
	    "532331": "禄丰县",
	    "532332": "其它区",
	    "532500": "红河哈尼族彝族自治州",
	    "532501": "个旧市",
	    "532502": "开远市",
	    "532522": "蒙自市",
	    "532523": "屏边苗族自治县",
	    "532524": "建水县",
	    "532525": "石屏县",
	    "532526": "弥勒市",
	    "532527": "泸西县",
	    "532528": "元阳县",
	    "532529": "红河县",
	    "532530": "金平苗族瑶族傣族自治县",
	    "532531": "绿春县",
	    "532532": "河口瑶族自治县",
	    "532533": "其它区",
	    "532600": "文山壮族苗族自治州",
	    "532621": "文山市",
	    "532622": "砚山县",
	    "532623": "西畴县",
	    "532624": "麻栗坡县",
	    "532625": "马关县",
	    "532626": "丘北县",
	    "532627": "广南县",
	    "532628": "富宁县",
	    "532629": "其它区",
	    "532800": "西双版纳傣族自治州",
	    "532801": "景洪市",
	    "532822": "勐海县",
	    "532823": "勐腊县",
	    "532824": "其它区",
	    "532900": "大理白族自治州",
	    "532901": "大理市",
	    "532922": "漾濞彝族自治县",
	    "532923": "祥云县",
	    "532924": "宾川县",
	    "532925": "弥渡县",
	    "532926": "南涧彝族自治县",
	    "532927": "巍山彝族回族自治县",
	    "532928": "永平县",
	    "532929": "云龙县",
	    "532930": "洱源县",
	    "532931": "剑川县",
	    "532932": "鹤庆县",
	    "532933": "其它区",
	    "533100": "德宏傣族景颇族自治州",
	    "533102": "瑞丽市",
	    "533103": "芒市",
	    "533122": "梁河县",
	    "533123": "盈江县",
	    "533124": "陇川县",
	    "533125": "其它区",
	    "533300": "怒江傈僳族自治州",
	    "533321": "泸水县",
	    "533323": "福贡县",
	    "533324": "贡山独龙族怒族自治县",
	    "533325": "兰坪白族普米族自治县",
	    "533326": "其它区",
	    "533400": "迪庆藏族自治州",
	    "533421": "香格里拉县",
	    "533422": "德钦县",
	    "533423": "维西傈僳族自治县",
	    "533424": "其它区",
	    "540000": "西藏自治区",
	    "540100": "拉萨市",
	    "540102": "城关区",
	    "540121": "林周县",
	    "540122": "当雄县",
	    "540123": "尼木县",
	    "540124": "曲水县",
	    "540125": "堆龙德庆县",
	    "540126": "达孜县",
	    "540127": "墨竹工卡县",
	    "540128": "其它区",
	    "542100": "昌都地区",
	    "542121": "昌都县",
	    "542122": "江达县",
	    "542123": "贡觉县",
	    "542124": "类乌齐县",
	    "542125": "丁青县",
	    "542126": "察雅县",
	    "542127": "八宿县",
	    "542128": "左贡县",
	    "542129": "芒康县",
	    "542132": "洛隆县",
	    "542133": "边坝县",
	    "542134": "其它区",
	    "542200": "山南地区",
	    "542221": "乃东县",
	    "542222": "扎囊县",
	    "542223": "贡嘎县",
	    "542224": "桑日县",
	    "542225": "琼结县",
	    "542226": "曲松县",
	    "542227": "措美县",
	    "542228": "洛扎县",
	    "542229": "加查县",
	    "542231": "隆子县",
	    "542232": "错那县",
	    "542233": "浪卡子县",
	    "542234": "其它区",
	    "542300": "日喀则地区",
	    "542301": "日喀则市",
	    "542322": "南木林县",
	    "542323": "江孜县",
	    "542324": "定日县",
	    "542325": "萨迦县",
	    "542326": "拉孜县",
	    "542327": "昂仁县",
	    "542328": "谢通门县",
	    "542329": "白朗县",
	    "542330": "仁布县",
	    "542331": "康马县",
	    "542332": "定结县",
	    "542333": "仲巴县",
	    "542334": "亚东县",
	    "542335": "吉隆县",
	    "542336": "聂拉木县",
	    "542337": "萨嘎县",
	    "542338": "岗巴县",
	    "542339": "其它区",
	    "542400": "那曲地区",
	    "542421": "那曲县",
	    "542422": "嘉黎县",
	    "542423": "比如县",
	    "542424": "聂荣县",
	    "542425": "安多县",
	    "542426": "申扎县",
	    "542427": "索县",
	    "542428": "班戈县",
	    "542429": "巴青县",
	    "542430": "尼玛县",
	    "542431": "其它区",
	    "542432": "双湖县",
	    "542500": "阿里地区",
	    "542521": "普兰县",
	    "542522": "札达县",
	    "542523": "噶尔县",
	    "542524": "日土县",
	    "542525": "革吉县",
	    "542526": "改则县",
	    "542527": "措勤县",
	    "542528": "其它区",
	    "542600": "林芝地区",
	    "542621": "林芝县",
	    "542622": "工布江达县",
	    "542623": "米林县",
	    "542624": "墨脱县",
	    "542625": "波密县",
	    "542626": "察隅县",
	    "542627": "朗县",
	    "542628": "其它区",
	    "610000": "陕西省",
	    "610100": "西安市",
	    "610102": "新城区",
	    "610103": "碑林区",
	    "610104": "莲湖区",
	    "610111": "灞桥区",
	    "610112": "未央区",
	    "610113": "雁塔区",
	    "610114": "阎良区",
	    "610115": "临潼区",
	    "610116": "长安区",
	    "610122": "蓝田县",
	    "610124": "周至县",
	    "610125": "户县",
	    "610126": "高陵县",
	    "610127": "其它区",
	    "610200": "铜川市",
	    "610202": "王益区",
	    "610203": "印台区",
	    "610204": "耀州区",
	    "610222": "宜君县",
	    "610223": "其它区",
	    "610300": "宝鸡市",
	    "610302": "渭滨区",
	    "610303": "金台区",
	    "610304": "陈仓区",
	    "610322": "凤翔县",
	    "610323": "岐山县",
	    "610324": "扶风县",
	    "610326": "眉县",
	    "610327": "陇县",
	    "610328": "千阳县",
	    "610329": "麟游县",
	    "610330": "凤县",
	    "610331": "太白县",
	    "610332": "其它区",
	    "610400": "咸阳市",
	    "610402": "秦都区",
	    "610403": "杨陵区",
	    "610404": "渭城区",
	    "610422": "三原县",
	    "610423": "泾阳县",
	    "610424": "乾县",
	    "610425": "礼泉县",
	    "610426": "永寿县",
	    "610427": "彬县",
	    "610428": "长武县",
	    "610429": "旬邑县",
	    "610430": "淳化县",
	    "610431": "武功县",
	    "610481": "兴平市",
	    "610482": "其它区",
	    "610500": "渭南市",
	    "610502": "临渭区",
	    "610521": "华县",
	    "610522": "潼关县",
	    "610523": "大荔县",
	    "610524": "合阳县",
	    "610525": "澄城县",
	    "610526": "蒲城县",
	    "610527": "白水县",
	    "610528": "富平县",
	    "610581": "韩城市",
	    "610582": "华阴市",
	    "610583": "其它区",
	    "610600": "延安市",
	    "610602": "宝塔区",
	    "610621": "延长县",
	    "610622": "延川县",
	    "610623": "子长县",
	    "610624": "安塞县",
	    "610625": "志丹县",
	    "610626": "吴起县",
	    "610627": "甘泉县",
	    "610628": "富县",
	    "610629": "洛川县",
	    "610630": "宜川县",
	    "610631": "黄龙县",
	    "610632": "黄陵县",
	    "610633": "其它区",
	    "610700": "汉中市",
	    "610702": "汉台区",
	    "610721": "南郑县",
	    "610722": "城固县",
	    "610723": "洋县",
	    "610724": "西乡县",
	    "610725": "勉县",
	    "610726": "宁强县",
	    "610727": "略阳县",
	    "610728": "镇巴县",
	    "610729": "留坝县",
	    "610730": "佛坪县",
	    "610731": "其它区",
	    "610800": "榆林市",
	    "610802": "榆阳区",
	    "610821": "神木县",
	    "610822": "府谷县",
	    "610823": "横山县",
	    "610824": "靖边县",
	    "610825": "定边县",
	    "610826": "绥德县",
	    "610827": "米脂县",
	    "610828": "佳县",
	    "610829": "吴堡县",
	    "610830": "清涧县",
	    "610831": "子洲县",
	    "610832": "其它区",
	    "610900": "安康市",
	    "610902": "汉滨区",
	    "610921": "汉阴县",
	    "610922": "石泉县",
	    "610923": "宁陕县",
	    "610924": "紫阳县",
	    "610925": "岚皋县",
	    "610926": "平利县",
	    "610927": "镇坪县",
	    "610928": "旬阳县",
	    "610929": "白河县",
	    "610930": "其它区",
	    "611000": "商洛市",
	    "611002": "商州区",
	    "611021": "洛南县",
	    "611022": "丹凤县",
	    "611023": "商南县",
	    "611024": "山阳县",
	    "611025": "镇安县",
	    "611026": "柞水县",
	    "611027": "其它区",
	    "620000": "甘肃省",
	    "620100": "兰州市",
	    "620102": "城关区",
	    "620103": "七里河区",
	    "620104": "西固区",
	    "620105": "安宁区",
	    "620111": "红古区",
	    "620121": "永登县",
	    "620122": "皋兰县",
	    "620123": "榆中县",
	    "620124": "其它区",
	    "620200": "嘉峪关市",
	    "620300": "金昌市",
	    "620302": "金川区",
	    "620321": "永昌县",
	    "620322": "其它区",
	    "620400": "白银市",
	    "620402": "白银区",
	    "620403": "平川区",
	    "620421": "靖远县",
	    "620422": "会宁县",
	    "620423": "景泰县",
	    "620424": "其它区",
	    "620500": "天水市",
	    "620502": "秦州区",
	    "620503": "麦积区",
	    "620521": "清水县",
	    "620522": "秦安县",
	    "620523": "甘谷县",
	    "620524": "武山县",
	    "620525": "张家川回族自治县",
	    "620526": "其它区",
	    "620600": "武威市",
	    "620602": "凉州区",
	    "620621": "民勤县",
	    "620622": "古浪县",
	    "620623": "天祝藏族自治县",
	    "620624": "其它区",
	    "620700": "张掖市",
	    "620702": "甘州区",
	    "620721": "肃南裕固族自治县",
	    "620722": "民乐县",
	    "620723": "临泽县",
	    "620724": "高台县",
	    "620725": "山丹县",
	    "620726": "其它区",
	    "620800": "平凉市",
	    "620802": "崆峒区",
	    "620821": "泾川县",
	    "620822": "灵台县",
	    "620823": "崇信县",
	    "620824": "华亭县",
	    "620825": "庄浪县",
	    "620826": "静宁县",
	    "620827": "其它区",
	    "620900": "酒泉市",
	    "620902": "肃州区",
	    "620921": "金塔县",
	    "620922": "瓜州县",
	    "620923": "肃北蒙古族自治县",
	    "620924": "阿克塞哈萨克族自治县",
	    "620981": "玉门市",
	    "620982": "敦煌市",
	    "620983": "其它区",
	    "621000": "庆阳市",
	    "621002": "西峰区",
	    "621021": "庆城县",
	    "621022": "环县",
	    "621023": "华池县",
	    "621024": "合水县",
	    "621025": "正宁县",
	    "621026": "宁县",
	    "621027": "镇原县",
	    "621028": "其它区",
	    "621100": "定西市",
	    "621102": "安定区",
	    "621121": "通渭县",
	    "621122": "陇西县",
	    "621123": "渭源县",
	    "621124": "临洮县",
	    "621125": "漳县",
	    "621126": "岷县",
	    "621127": "其它区",
	    "621200": "陇南市",
	    "621202": "武都区",
	    "621221": "成县",
	    "621222": "文县",
	    "621223": "宕昌县",
	    "621224": "康县",
	    "621225": "西和县",
	    "621226": "礼县",
	    "621227": "徽县",
	    "621228": "两当县",
	    "621229": "其它区",
	    "622900": "临夏回族自治州",
	    "622901": "临夏市",
	    "622921": "临夏县",
	    "622922": "康乐县",
	    "622923": "永靖县",
	    "622924": "广河县",
	    "622925": "和政县",
	    "622926": "东乡族自治县",
	    "622927": "积石山保安族东乡族撒拉族自治县",
	    "622928": "其它区",
	    "623000": "甘南藏族自治州",
	    "623001": "合作市",
	    "623021": "临潭县",
	    "623022": "卓尼县",
	    "623023": "舟曲县",
	    "623024": "迭部县",
	    "623025": "玛曲县",
	    "623026": "碌曲县",
	    "623027": "夏河县",
	    "623028": "其它区",
	    "630000": "青海省",
	    "630100": "西宁市",
	    "630102": "城东区",
	    "630103": "城中区",
	    "630104": "城西区",
	    "630105": "城北区",
	    "630121": "大通回族土族自治县",
	    "630122": "湟中县",
	    "630123": "湟源县",
	    "630124": "其它区",
	    "632100": "海东市",
	    "632121": "平安县",
	    "632122": "民和回族土族自治县",
	    "632123": "乐都区",
	    "632126": "互助土族自治县",
	    "632127": "化隆回族自治县",
	    "632128": "循化撒拉族自治县",
	    "632129": "其它区",
	    "632200": "海北藏族自治州",
	    "632221": "门源回族自治县",
	    "632222": "祁连县",
	    "632223": "海晏县",
	    "632224": "刚察县",
	    "632225": "其它区",
	    "632300": "黄南藏族自治州",
	    "632321": "同仁县",
	    "632322": "尖扎县",
	    "632323": "泽库县",
	    "632324": "河南蒙古族自治县",
	    "632325": "其它区",
	    "632500": "海南藏族自治州",
	    "632521": "共和县",
	    "632522": "同德县",
	    "632523": "贵德县",
	    "632524": "兴海县",
	    "632525": "贵南县",
	    "632526": "其它区",
	    "632600": "果洛藏族自治州",
	    "632621": "玛沁县",
	    "632622": "班玛县",
	    "632623": "甘德县",
	    "632624": "达日县",
	    "632625": "久治县",
	    "632626": "玛多县",
	    "632627": "其它区",
	    "632700": "玉树藏族自治州",
	    "632721": "玉树市",
	    "632722": "杂多县",
	    "632723": "称多县",
	    "632724": "治多县",
	    "632725": "囊谦县",
	    "632726": "曲麻莱县",
	    "632727": "其它区",
	    "632800": "海西蒙古族藏族自治州",
	    "632801": "格尔木市",
	    "632802": "德令哈市",
	    "632821": "乌兰县",
	    "632822": "都兰县",
	    "632823": "天峻县",
	    "632824": "其它区",
	    "640000": "宁夏回族自治区",
	    "640100": "银川市",
	    "640104": "兴庆区",
	    "640105": "西夏区",
	    "640106": "金凤区",
	    "640121": "永宁县",
	    "640122": "贺兰县",
	    "640181": "灵武市",
	    "640182": "其它区",
	    "640200": "石嘴山市",
	    "640202": "大武口区",
	    "640205": "惠农区",
	    "640221": "平罗县",
	    "640222": "其它区",
	    "640300": "吴忠市",
	    "640302": "利通区",
	    "640303": "红寺堡区",
	    "640323": "盐池县",
	    "640324": "同心县",
	    "640381": "青铜峡市",
	    "640382": "其它区",
	    "640400": "固原市",
	    "640402": "原州区",
	    "640422": "西吉县",
	    "640423": "隆德县",
	    "640424": "泾源县",
	    "640425": "彭阳县",
	    "640426": "其它区",
	    "640500": "中卫市",
	    "640502": "沙坡头区",
	    "640521": "中宁县",
	    "640522": "海原县",
	    "640523": "其它区",
	    "650000": "新疆维吾尔自治区",
	    "650100": "乌鲁木齐市",
	    "650102": "天山区",
	    "650103": "沙依巴克区",
	    "650104": "新市区",
	    "650105": "水磨沟区",
	    "650106": "头屯河区",
	    "650107": "达坂城区",
	    "650109": "米东区",
	    "650121": "乌鲁木齐县",
	    "650122": "其它区",
	    "650200": "克拉玛依市",
	    "650202": "独山子区",
	    "650203": "克拉玛依区",
	    "650204": "白碱滩区",
	    "650205": "乌尔禾区",
	    "650206": "其它区",
	    "652100": "吐鲁番地区",
	    "652101": "吐鲁番市",
	    "652122": "鄯善县",
	    "652123": "托克逊县",
	    "652124": "其它区",
	    "652200": "哈密地区",
	    "652201": "哈密市",
	    "652222": "巴里坤哈萨克自治县",
	    "652223": "伊吾县",
	    "652224": "其它区",
	    "652300": "昌吉回族自治州",
	    "652301": "昌吉市",
	    "652302": "阜康市",
	    "652323": "呼图壁县",
	    "652324": "玛纳斯县",
	    "652325": "奇台县",
	    "652327": "吉木萨尔县",
	    "652328": "木垒哈萨克自治县",
	    "652329": "其它区",
	    "652700": "博尔塔拉蒙古自治州",
	    "652701": "博乐市",
	    "652702": "阿拉山口市",
	    "652722": "精河县",
	    "652723": "温泉县",
	    "652724": "其它区",
	    "652800": "巴音郭楞蒙古自治州",
	    "652801": "库尔勒市",
	    "652822": "轮台县",
	    "652823": "尉犁县",
	    "652824": "若羌县",
	    "652825": "且末县",
	    "652826": "焉耆回族自治县",
	    "652827": "和静县",
	    "652828": "和硕县",
	    "652829": "博湖县",
	    "652830": "其它区",
	    "652900": "阿克苏地区",
	    "652901": "阿克苏市",
	    "652922": "温宿县",
	    "652923": "库车县",
	    "652924": "沙雅县",
	    "652925": "新和县",
	    "652926": "拜城县",
	    "652927": "乌什县",
	    "652928": "阿瓦提县",
	    "652929": "柯坪县",
	    "652930": "其它区",
	    "653000": "克孜勒苏柯尔克孜自治州",
	    "653001": "阿图什市",
	    "653022": "阿克陶县",
	    "653023": "阿合奇县",
	    "653024": "乌恰县",
	    "653025": "其它区",
	    "653100": "喀什地区",
	    "653101": "喀什市",
	    "653121": "疏附县",
	    "653122": "疏勒县",
	    "653123": "英吉沙县",
	    "653124": "泽普县",
	    "653125": "莎车县",
	    "653126": "叶城县",
	    "653127": "麦盖提县",
	    "653128": "岳普湖县",
	    "653129": "伽师县",
	    "653130": "巴楚县",
	    "653131": "塔什库尔干塔吉克自治县",
	    "653132": "其它区",
	    "653200": "和田地区",
	    "653201": "和田市",
	    "653221": "和田县",
	    "653222": "墨玉县",
	    "653223": "皮山县",
	    "653224": "洛浦县",
	    "653225": "策勒县",
	    "653226": "于田县",
	    "653227": "民丰县",
	    "653228": "其它区",
	    "654000": "伊犁哈萨克自治州",
	    "654002": "伊宁市",
	    "654003": "奎屯市",
	    "654021": "伊宁县",
	    "654022": "察布查尔锡伯自治县",
	    "654023": "霍城县",
	    "654024": "巩留县",
	    "654025": "新源县",
	    "654026": "昭苏县",
	    "654027": "特克斯县",
	    "654028": "尼勒克县",
	    "654029": "其它区",
	    "654200": "塔城地区",
	    "654201": "塔城市",
	    "654202": "乌苏市",
	    "654221": "额敏县",
	    "654223": "沙湾县",
	    "654224": "托里县",
	    "654225": "裕民县",
	    "654226": "和布克赛尔蒙古自治县",
	    "654227": "其它区",
	    "654300": "阿勒泰地区",
	    "654301": "阿勒泰市",
	    "654321": "布尔津县",
	    "654322": "富蕴县",
	    "654323": "福海县",
	    "654324": "哈巴河县",
	    "654325": "青河县",
	    "654326": "吉木乃县",
	    "654327": "其它区",
	    "659001": "石河子市",
	    "659002": "阿拉尔市",
	    "659003": "图木舒克市",
	    "659004": "五家渠市",
	    "710000": "台湾",
	    "710100": "台北市",
	    "710101": "中正区",
	    "710102": "大同区",
	    "710103": "中山区",
	    "710104": "松山区",
	    "710105": "大安区",
	    "710106": "万华区",
	    "710107": "信义区",
	    "710108": "士林区",
	    "710109": "北投区",
	    "710110": "内湖区",
	    "710111": "南港区",
	    "710112": "文山区",
	    "710113": "其它区",
	    "710200": "高雄市",
	    "710201": "新兴区",
	    "710202": "前金区",
	    "710203": "芩雅区",
	    "710204": "盐埕区",
	    "710205": "鼓山区",
	    "710206": "旗津区",
	    "710207": "前镇区",
	    "710208": "三民区",
	    "710209": "左营区",
	    "710210": "楠梓区",
	    "710211": "小港区",
	    "710212": "其它区",
	    "710241": "苓雅区",
	    "710242": "仁武区",
	    "710243": "大社区",
	    "710244": "冈山区",
	    "710245": "路竹区",
	    "710246": "阿莲区",
	    "710247": "田寮区",
	    "710248": "燕巢区",
	    "710249": "桥头区",
	    "710250": "梓官区",
	    "710251": "弥陀区",
	    "710252": "永安区",
	    "710253": "湖内区",
	    "710254": "凤山区",
	    "710255": "大寮区",
	    "710256": "林园区",
	    "710257": "鸟松区",
	    "710258": "大树区",
	    "710259": "旗山区",
	    "710260": "美浓区",
	    "710261": "六龟区",
	    "710262": "内门区",
	    "710263": "杉林区",
	    "710264": "甲仙区",
	    "710265": "桃源区",
	    "710266": "那玛夏区",
	    "710267": "茂林区",
	    "710268": "茄萣区",
	    "710300": "台南市",
	    "710301": "中西区",
	    "710302": "东区",
	    "710303": "南区",
	    "710304": "北区",
	    "710305": "安平区",
	    "710306": "安南区",
	    "710307": "其它区",
	    "710339": "永康区",
	    "710340": "归仁区",
	    "710341": "新化区",
	    "710342": "左镇区",
	    "710343": "玉井区",
	    "710344": "楠西区",
	    "710345": "南化区",
	    "710346": "仁德区",
	    "710347": "关庙区",
	    "710348": "龙崎区",
	    "710349": "官田区",
	    "710350": "麻豆区",
	    "710351": "佳里区",
	    "710352": "西港区",
	    "710353": "七股区",
	    "710354": "将军区",
	    "710355": "学甲区",
	    "710356": "北门区",
	    "710357": "新营区",
	    "710358": "后壁区",
	    "710359": "白河区",
	    "710360": "东山区",
	    "710361": "六甲区",
	    "710362": "下营区",
	    "710363": "柳营区",
	    "710364": "盐水区",
	    "710365": "善化区",
	    "710366": "大内区",
	    "710367": "山上区",
	    "710368": "新市区",
	    "710369": "安定区",
	    "710400": "台中市",
	    "710401": "中区",
	    "710402": "东区",
	    "710403": "南区",
	    "710404": "西区",
	    "710405": "北区",
	    "710406": "北屯区",
	    "710407": "西屯区",
	    "710408": "南屯区",
	    "710409": "其它区",
	    "710431": "太平区",
	    "710432": "大里区",
	    "710433": "雾峰区",
	    "710434": "乌日区",
	    "710435": "丰原区",
	    "710436": "后里区",
	    "710437": "石冈区",
	    "710438": "东势区",
	    "710439": "和平区",
	    "710440": "新社区",
	    "710441": "潭子区",
	    "710442": "大雅区",
	    "710443": "神冈区",
	    "710444": "大肚区",
	    "710445": "沙鹿区",
	    "710446": "龙井区",
	    "710447": "梧栖区",
	    "710448": "清水区",
	    "710449": "大甲区",
	    "710450": "外埔区",
	    "710451": "大安区",
	    "710500": "金门县",
	    "710507": "金沙镇",
	    "710508": "金湖镇",
	    "710509": "金宁乡",
	    "710510": "金城镇",
	    "710511": "烈屿乡",
	    "710512": "乌坵乡",
	    "710600": "南投县",
	    "710614": "南投市",
	    "710615": "中寮乡",
	    "710616": "草屯镇",
	    "710617": "国姓乡",
	    "710618": "埔里镇",
	    "710619": "仁爱乡",
	    "710620": "名间乡",
	    "710621": "集集镇",
	    "710622": "水里乡",
	    "710623": "鱼池乡",
	    "710624": "信义乡",
	    "710625": "竹山镇",
	    "710626": "鹿谷乡",
	    "710700": "基隆市",
	    "710701": "仁爱区",
	    "710702": "信义区",
	    "710703": "中正区",
	    "710704": "中山区",
	    "710705": "安乐区",
	    "710706": "暖暖区",
	    "710707": "七堵区",
	    "710708": "其它区",
	    "710800": "新竹市",
	    "710801": "东区",
	    "710802": "北区",
	    "710803": "香山区",
	    "710804": "其它区",
	    "710900": "嘉义市",
	    "710901": "东区",
	    "710902": "西区",
	    "710903": "其它区",
	    "711100": "新北市",
	    "711130": "万里区",
	    "711131": "金山区",
	    "711132": "板桥区",
	    "711133": "汐止区",
	    "711134": "深坑区",
	    "711135": "石碇区",
	    "711136": "瑞芳区",
	    "711137": "平溪区",
	    "711138": "双溪区",
	    "711139": "贡寮区",
	    "711140": "新店区",
	    "711141": "坪林区",
	    "711142": "乌来区",
	    "711143": "永和区",
	    "711144": "中和区",
	    "711145": "土城区",
	    "711146": "三峡区",
	    "711147": "树林区",
	    "711148": "莺歌区",
	    "711149": "三重区",
	    "711150": "新庄区",
	    "711151": "泰山区",
	    "711152": "林口区",
	    "711153": "芦洲区",
	    "711154": "五股区",
	    "711155": "八里区",
	    "711156": "淡水区",
	    "711157": "三芝区",
	    "711158": "石门区",
	    "711200": "宜兰县",
	    "711214": "宜兰市",
	    "711215": "头城镇",
	    "711216": "礁溪乡",
	    "711217": "壮围乡",
	    "711218": "员山乡",
	    "711219": "罗东镇",
	    "711220": "三星乡",
	    "711221": "大同乡",
	    "711222": "五结乡",
	    "711223": "冬山乡",
	    "711224": "苏澳镇",
	    "711225": "南澳乡",
	    "711226": "钓鱼台",
	    "711300": "新竹县",
	    "711314": "竹北市",
	    "711315": "湖口乡",
	    "711316": "新丰乡",
	    "711317": "新埔镇",
	    "711318": "关西镇",
	    "711319": "芎林乡",
	    "711320": "宝山乡",
	    "711321": "竹东镇",
	    "711322": "五峰乡",
	    "711323": "横山乡",
	    "711324": "尖石乡",
	    "711325": "北埔乡",
	    "711326": "峨眉乡",
	    "711400": "桃园县",
	    "711414": "中坜市",
	    "711415": "平镇市",
	    "711416": "龙潭乡",
	    "711417": "杨梅市",
	    "711418": "新屋乡",
	    "711419": "观音乡",
	    "711420": "桃园市",
	    "711421": "龟山乡",
	    "711422": "八德市",
	    "711423": "大溪镇",
	    "711424": "复兴乡",
	    "711425": "大园乡",
	    "711426": "芦竹乡",
	    "711500": "苗栗县",
	    "711519": "竹南镇",
	    "711520": "头份镇",
	    "711521": "三湾乡",
	    "711522": "南庄乡",
	    "711523": "狮潭乡",
	    "711524": "后龙镇",
	    "711525": "通霄镇",
	    "711526": "苑里镇",
	    "711527": "苗栗市",
	    "711528": "造桥乡",
	    "711529": "头屋乡",
	    "711530": "公馆乡",
	    "711531": "大湖乡",
	    "711532": "泰安乡",
	    "711533": "铜锣乡",
	    "711534": "三义乡",
	    "711535": "西湖乡",
	    "711536": "卓兰镇",
	    "711700": "彰化县",
	    "711727": "彰化市",
	    "711728": "芬园乡",
	    "711729": "花坛乡",
	    "711730": "秀水乡",
	    "711731": "鹿港镇",
	    "711732": "福兴乡",
	    "711733": "线西乡",
	    "711734": "和美镇",
	    "711735": "伸港乡",
	    "711736": "员林镇",
	    "711737": "社头乡",
	    "711738": "永靖乡",
	    "711739": "埔心乡",
	    "711740": "溪湖镇",
	    "711741": "大村乡",
	    "711742": "埔盐乡",
	    "711743": "田中镇",
	    "711744": "北斗镇",
	    "711745": "田尾乡",
	    "711746": "埤头乡",
	    "711747": "溪州乡",
	    "711748": "竹塘乡",
	    "711749": "二林镇",
	    "711750": "大城乡",
	    "711751": "芳苑乡",
	    "711752": "二水乡",
	    "711900": "嘉义县",
	    "711919": "番路乡",
	    "711920": "梅山乡",
	    "711921": "竹崎乡",
	    "711922": "阿里山乡",
	    "711923": "中埔乡",
	    "711924": "大埔乡",
	    "711925": "水上乡",
	    "711926": "鹿草乡",
	    "711927": "太保市",
	    "711928": "朴子市",
	    "711929": "东石乡",
	    "711930": "六脚乡",
	    "711931": "新港乡",
	    "711932": "民雄乡",
	    "711933": "大林镇",
	    "711934": "溪口乡",
	    "711935": "义竹乡",
	    "711936": "布袋镇",
	    "712100": "云林县",
	    "712121": "斗南镇",
	    "712122": "大埤乡",
	    "712123": "虎尾镇",
	    "712124": "土库镇",
	    "712125": "褒忠乡",
	    "712126": "东势乡",
	    "712127": "台西乡",
	    "712128": "仑背乡",
	    "712129": "麦寮乡",
	    "712130": "斗六市",
	    "712131": "林内乡",
	    "712132": "古坑乡",
	    "712133": "莿桐乡",
	    "712134": "西螺镇",
	    "712135": "二仑乡",
	    "712136": "北港镇",
	    "712137": "水林乡",
	    "712138": "口湖乡",
	    "712139": "四湖乡",
	    "712140": "元长乡",
	    "712400": "屏东县",
	    "712434": "屏东市",
	    "712435": "三地门乡",
	    "712436": "雾台乡",
	    "712437": "玛家乡",
	    "712438": "九如乡",
	    "712439": "里港乡",
	    "712440": "高树乡",
	    "712441": "盐埔乡",
	    "712442": "长治乡",
	    "712443": "麟洛乡",
	    "712444": "竹田乡",
	    "712445": "内埔乡",
	    "712446": "万丹乡",
	    "712447": "潮州镇",
	    "712448": "泰武乡",
	    "712449": "来义乡",
	    "712450": "万峦乡",
	    "712451": "崁顶乡",
	    "712452": "新埤乡",
	    "712453": "南州乡",
	    "712454": "林边乡",
	    "712455": "东港镇",
	    "712456": "琉球乡",
	    "712457": "佳冬乡",
	    "712458": "新园乡",
	    "712459": "枋寮乡",
	    "712460": "枋山乡",
	    "712461": "春日乡",
	    "712462": "狮子乡",
	    "712463": "车城乡",
	    "712464": "牡丹乡",
	    "712465": "恒春镇",
	    "712466": "满州乡",
	    "712500": "台东县",
	    "712517": "台东市",
	    "712518": "绿岛乡",
	    "712519": "兰屿乡",
	    "712520": "延平乡",
	    "712521": "卑南乡",
	    "712522": "鹿野乡",
	    "712523": "关山镇",
	    "712524": "海端乡",
	    "712525": "池上乡",
	    "712526": "东河乡",
	    "712527": "成功镇",
	    "712528": "长滨乡",
	    "712529": "金峰乡",
	    "712530": "大武乡",
	    "712531": "达仁乡",
	    "712532": "太麻里乡",
	    "712600": "花莲县",
	    "712615": "花莲市",
	    "712616": "新城乡",
	    "712617": "太鲁阁",
	    "712618": "秀林乡",
	    "712619": "吉安乡",
	    "712620": "寿丰乡",
	    "712621": "凤林镇",
	    "712622": "光复乡",
	    "712623": "丰滨乡",
	    "712624": "瑞穗乡",
	    "712625": "万荣乡",
	    "712626": "玉里镇",
	    "712627": "卓溪乡",
	    "712628": "富里乡",
	    "712700": "澎湖县",
	    "712707": "马公市",
	    "712708": "西屿乡",
	    "712709": "望安乡",
	    "712710": "七美乡",
	    "712711": "白沙乡",
	    "712712": "湖西乡",
	    "712800": "连江县",
	    "712805": "南竿乡",
	    "712806": "北竿乡",
	    "712807": "莒光乡",
	    "712808": "东引乡",
	    "810000": "香港特别行政区",
	    "810100": "香港岛",
	    "810101": "中西区",
	    "810102": "湾仔",
	    "810103": "东区",
	    "810104": "南区",
	    "810200": "九龙",
	    "810201": "九龙城区",
	    "810202": "油尖旺区",
	    "810203": "深水埗区",
	    "810204": "黄大仙区",
	    "810205": "观塘区",
	    "810300": "新界",
	    "810301": "北区",
	    "810302": "大埔区",
	    "810303": "沙田区",
	    "810304": "西贡区",
	    "810305": "元朗区",
	    "810306": "屯门区",
	    "810307": "荃湾区",
	    "810308": "葵青区",
	    "810309": "离岛区",
	    "820000": "澳门特别行政区",
	    "820100": "澳门半岛",
	    "820200": "离岛",
	    "990000": "海外",
	    "990100": "海外"
	}

	// id pid/parentId name children
	function tree(list) {
	    var mapped = {}
	    for (var i = 0, item; i < list.length; i++) {
	        item = list[i]
	        if (!item || !item.id) continue
	        mapped[item.id] = item
	    }

	    var result = []
	    for (var ii = 0; ii < list.length; ii++) {
	        item = list[ii]

	        if (!item) continue
	            /* jshint -W041 */
	        if (item.pid == undefined && item.parentId == undefined) {
	            result.push(item)
	            continue
	        }
	        var parent = mapped[item.pid] || mapped[item.parentId]
	        if (!parent) continue
	        if (!parent.children) parent.children = []
	        parent.children.push(item)
	    }
	    return result
	}

	var DICT_FIXED = function() {
	    var fixed = []
	    for (var id in DICT) {
	        var pid = id.slice(2, 6) === '0000' ? undefined :
	            id.slice(4, 6) == '00' ? (id.slice(0, 2) + '0000') :
	            id.slice(0, 4) + '00'
	        fixed.push({
	            id: id,
	            pid: pid,
	            name: DICT[id]
	        })
	    }
	    return tree(fixed)
	}()

	module.exports = DICT_FIXED

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Miscellaneous
	*/
	var DICT = __webpack_require__(18)
	module.exports = {
		// Dice
		d4: function() {
			return this.natural(1, 4)
		},
		d6: function() {
			return this.natural(1, 6)
		},
		d8: function() {
			return this.natural(1, 8)
		},
		d12: function() {
			return this.natural(1, 12)
		},
		d20: function() {
			return this.natural(1, 20)
		},
		d100: function() {
			return this.natural(1, 100)
		},
		/*
		    随机生成一个 GUID。

		    http://www.broofa.com/2008/09/javascript-uuid-function/
		    [UUID 规范](http://www.ietf.org/rfc/rfc4122.txt)
		        UUIDs (Universally Unique IDentifier)
		        GUIDs (Globally Unique IDentifier)
		        The formal definition of the UUID string representation is provided by the following ABNF [7]:
		            UUID                   = time-low "-" time-mid "-"
		                                   time-high-and-version "-"
		                                   clock-seq-and-reserved
		                                   clock-seq-low "-" node
		            time-low               = 4hexOctet
		            time-mid               = 2hexOctet
		            time-high-and-version  = 2hexOctet
		            clock-seq-and-reserved = hexOctet
		            clock-seq-low          = hexOctet
		            node                   = 6hexOctet
		            hexOctet               = hexDigit hexDigit
		            hexDigit =
		                "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
		                "a" / "b" / "c" / "d" / "e" / "f" /
		                "A" / "B" / "C" / "D" / "E" / "F"
		    
		    https://github.com/victorquinn/chancejs/blob/develop/chance.js#L1349
		*/
		guid: function() {
			var pool = "abcdefABCDEF1234567890",
				guid = this.string(pool, 8) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 12);
			return guid
		},
		uuid: function() {
			return this.guid()
		},
		/*
		    随机生成一个 18 位身份证。

		    [身份证](http://baike.baidu.com/view/1697.htm#4)
		        地址码 6 + 出生日期码 8 + 顺序码 3 + 校验码 1
		    [《中华人民共和国行政区划代码》国家标准(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)
		*/
		id: function() {
			var id,
				sum = 0,
				rank = [
					"7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"
				],
				last = [
					"1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"
				]

			id = this.pick(DICT).id +
				this.date('yyyyMMdd') +
				this.string('number', 3)

			for (var i = 0; i < id.length; i++) {
				sum += id[i] * rank[i];
			}
			id += last[sum % 11];

			return id
		},

		/*
		    生成一个全局的自增整数。
		    类似自增主键（auto increment primary key）。
		*/
		increment: function() {
			var key = 0
			return function(step) {
				return key += (+step || 1) // step?
			}
		}(),
		inc: function(step) {
			return this.increment(step)
		}
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Parser = __webpack_require__(21)
	var Handler = __webpack_require__(22)
	module.exports = {
		Parser: Parser,
		Handler: Handler
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	// https://github.com/nuysoft/regexp
	// forked from https://github.com/ForbesLindesay/regexp

	function parse(n) {
	    if ("string" != typeof n) {
	        var l = new TypeError("The regexp to parse must be represented as a string.");
	        throw l;
	    }
	    return index = 1, cgs = {}, parser.parse(n);
	}

	function Token(n) {
	    this.type = n, this.offset = Token.offset(), this.text = Token.text();
	}

	function Alternate(n, l) {
	    Token.call(this, "alternate"), this.left = n, this.right = l;
	}

	function Match(n) {
	    Token.call(this, "match"), this.body = n.filter(Boolean);
	}

	function Group(n, l) {
	    Token.call(this, n), this.body = l;
	}

	function CaptureGroup(n) {
	    Group.call(this, "capture-group"), this.index = cgs[this.offset] || (cgs[this.offset] = index++), 
	    this.body = n;
	}

	function Quantified(n, l) {
	    Token.call(this, "quantified"), this.body = n, this.quantifier = l;
	}

	function Quantifier(n, l) {
	    Token.call(this, "quantifier"), this.min = n, this.max = l, this.greedy = !0;
	}

	function CharSet(n, l) {
	    Token.call(this, "charset"), this.invert = n, this.body = l;
	}

	function CharacterRange(n, l) {
	    Token.call(this, "range"), this.start = n, this.end = l;
	}

	function Literal(n) {
	    Token.call(this, "literal"), this.body = n, this.escaped = this.body != this.text;
	}

	function Unicode(n) {
	    Token.call(this, "unicode"), this.code = n.toUpperCase();
	}

	function Hex(n) {
	    Token.call(this, "hex"), this.code = n.toUpperCase();
	}

	function Octal(n) {
	    Token.call(this, "octal"), this.code = n.toUpperCase();
	}

	function BackReference(n) {
	    Token.call(this, "back-reference"), this.code = n.toUpperCase();
	}

	function ControlCharacter(n) {
	    Token.call(this, "control-character"), this.code = n.toUpperCase();
	}

	var parser = function() {
	    function n(n, l) {
	        function u() {
	            this.constructor = n;
	        }
	        u.prototype = l.prototype, n.prototype = new u();
	    }
	    function l(n, l, u, t, r) {
	        function e(n, l) {
	            function u(n) {
	                function l(n) {
	                    return n.charCodeAt(0).toString(16).toUpperCase();
	                }
	                return n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(n) {
	                    return "\\x0" + l(n);
	                }).replace(/[\x10-\x1F\x80-\xFF]/g, function(n) {
	                    return "\\x" + l(n);
	                }).replace(/[\u0180-\u0FFF]/g, function(n) {
	                    return "\\u0" + l(n);
	                }).replace(/[\u1080-\uFFFF]/g, function(n) {
	                    return "\\u" + l(n);
	                });
	            }
	            var t, r;
	            switch (n.length) {
	              case 0:
	                t = "end of input";
	                break;

	              case 1:
	                t = n[0];
	                break;

	              default:
	                t = n.slice(0, -1).join(", ") + " or " + n[n.length - 1];
	            }
	            return r = l ? '"' + u(l) + '"' : "end of input", "Expected " + t + " but " + r + " found.";
	        }
	        this.expected = n, this.found = l, this.offset = u, this.line = t, this.column = r, 
	        this.name = "SyntaxError", this.message = e(n, l);
	    }
	    function u(n) {
	        function u() {
	            return n.substring(Lt, qt);
	        }
	        function t() {
	            return Lt;
	        }
	        function r(l) {
	            function u(l, u, t) {
	                var r, e;
	                for (r = u; t > r; r++) e = n.charAt(r), "\n" === e ? (l.seenCR || l.line++, l.column = 1, 
	                l.seenCR = !1) : "\r" === e || "\u2028" === e || "\u2029" === e ? (l.line++, l.column = 1, 
	                l.seenCR = !0) : (l.column++, l.seenCR = !1);
	            }
	            return Mt !== l && (Mt > l && (Mt = 0, Dt = {
	                line: 1,
	                column: 1,
	                seenCR: !1
	            }), u(Dt, Mt, l), Mt = l), Dt;
	        }
	        function e(n) {
	            Ht > qt || (qt > Ht && (Ht = qt, Ot = []), Ot.push(n));
	        }
	        function o(n) {
	            var l = 0;
	            for (n.sort(); l < n.length; ) n[l - 1] === n[l] ? n.splice(l, 1) : l++;
	        }
	        function c() {
	            var l, u, t, r, o;
	            return l = qt, u = i(), null !== u ? (t = qt, 124 === n.charCodeAt(qt) ? (r = fl, 
	            qt++) : (r = null, 0 === Wt && e(sl)), null !== r ? (o = c(), null !== o ? (r = [ r, o ], 
	            t = r) : (qt = t, t = il)) : (qt = t, t = il), null === t && (t = al), null !== t ? (Lt = l, 
	            u = hl(u, t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, 
	            l = il), l;
	        }
	        function i() {
	            var n, l, u, t, r;
	            if (n = qt, l = f(), null === l && (l = al), null !== l) if (u = qt, Wt++, t = d(), 
	            Wt--, null === t ? u = al : (qt = u, u = il), null !== u) {
	                for (t = [], r = h(), null === r && (r = a()); null !== r; ) t.push(r), r = h(), 
	                null === r && (r = a());
	                null !== t ? (r = s(), null === r && (r = al), null !== r ? (Lt = n, l = dl(l, t, r), 
	                null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il);
	            } else qt = n, n = il; else qt = n, n = il;
	            return n;
	        }
	        function a() {
	            var n;
	            return n = x(), null === n && (n = Q(), null === n && (n = B())), n;
	        }
	        function f() {
	            var l, u;
	            return l = qt, 94 === n.charCodeAt(qt) ? (u = pl, qt++) : (u = null, 0 === Wt && e(vl)), 
	            null !== u && (Lt = l, u = wl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function s() {
	            var l, u;
	            return l = qt, 36 === n.charCodeAt(qt) ? (u = Al, qt++) : (u = null, 0 === Wt && e(Cl)), 
	            null !== u && (Lt = l, u = gl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function h() {
	            var n, l, u;
	            return n = qt, l = a(), null !== l ? (u = d(), null !== u ? (Lt = n, l = bl(l, u), 
	            null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il), n;
	        }
	        function d() {
	            var n, l, u;
	            return Wt++, n = qt, l = p(), null !== l ? (u = k(), null === u && (u = al), null !== u ? (Lt = n, 
	            l = Tl(l, u), null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, 
	            n = il), Wt--, null === n && (l = null, 0 === Wt && e(kl)), n;
	        }
	        function p() {
	            var n;
	            return n = v(), null === n && (n = w(), null === n && (n = A(), null === n && (n = C(), 
	            null === n && (n = g(), null === n && (n = b()))))), n;
	        }
	        function v() {
	            var l, u, t, r, o, c;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (44 === n.charCodeAt(qt) ? (r = ml, qt++) : (r = null, 
	            0 === Wt && e(Rl)), null !== r ? (o = T(), null !== o ? (125 === n.charCodeAt(qt) ? (c = Fl, 
	            qt++) : (c = null, 0 === Wt && e(Ql)), null !== c ? (Lt = l, u = Sl(t, o), null === u ? (qt = l, 
	            l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function w() {
	            var l, u, t, r;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (n.substr(qt, 2) === Ul ? (r = Ul, qt += 2) : (r = null, 
	            0 === Wt && e(El)), null !== r ? (Lt = l, u = Gl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function A() {
	            var l, u, t, r;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (125 === n.charCodeAt(qt) ? (r = Fl, qt++) : (r = null, 
	            0 === Wt && e(Ql)), null !== r ? (Lt = l, u = Bl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function C() {
	            var l, u;
	            return l = qt, 43 === n.charCodeAt(qt) ? (u = jl, qt++) : (u = null, 0 === Wt && e($l)), 
	            null !== u && (Lt = l, u = ql()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function g() {
	            var l, u;
	            return l = qt, 42 === n.charCodeAt(qt) ? (u = Ll, qt++) : (u = null, 0 === Wt && e(Ml)), 
	            null !== u && (Lt = l, u = Dl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function b() {
	            var l, u;
	            return l = qt, 63 === n.charCodeAt(qt) ? (u = Hl, qt++) : (u = null, 0 === Wt && e(Ol)), 
	            null !== u && (Lt = l, u = Wl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function k() {
	            var l;
	            return 63 === n.charCodeAt(qt) ? (l = Hl, qt++) : (l = null, 0 === Wt && e(Ol)), 
	            l;
	        }
	        function T() {
	            var l, u, t;
	            if (l = qt, u = [], zl.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 
	            0 === Wt && e(Il)), null !== t) for (;null !== t; ) u.push(t), zl.test(n.charAt(qt)) ? (t = n.charAt(qt), 
	            qt++) : (t = null, 0 === Wt && e(Il)); else u = il;
	            return null !== u && (Lt = l, u = Jl(u)), null === u ? (qt = l, l = u) : l = u, 
	            l;
	        }
	        function x() {
	            var l, u, t, r;
	            return l = qt, 40 === n.charCodeAt(qt) ? (u = Kl, qt++) : (u = null, 0 === Wt && e(Nl)), 
	            null !== u ? (t = R(), null === t && (t = F(), null === t && (t = m(), null === t && (t = y()))), 
	            null !== t ? (41 === n.charCodeAt(qt) ? (r = Pl, qt++) : (r = null, 0 === Wt && e(Vl)), 
	            null !== r ? (Lt = l, u = Xl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function y() {
	            var n, l;
	            return n = qt, l = c(), null !== l && (Lt = n, l = Yl(l)), null === l ? (qt = n, 
	            n = l) : n = l, n;
	        }
	        function m() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === Zl ? (u = Zl, qt += 2) : (u = null, 0 === Wt && e(_l)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = nu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function R() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === lu ? (u = lu, qt += 2) : (u = null, 0 === Wt && e(uu)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = tu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function F() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === ru ? (u = ru, qt += 2) : (u = null, 0 === Wt && e(eu)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = ou(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function Q() {
	            var l, u, t, r, o;
	            if (Wt++, l = qt, 91 === n.charCodeAt(qt) ? (u = iu, qt++) : (u = null, 0 === Wt && e(au)), 
	            null !== u) if (94 === n.charCodeAt(qt) ? (t = pl, qt++) : (t = null, 0 === Wt && e(vl)), 
	            null === t && (t = al), null !== t) {
	                for (r = [], o = S(), null === o && (o = U()); null !== o; ) r.push(o), o = S(), 
	                null === o && (o = U());
	                null !== r ? (93 === n.charCodeAt(qt) ? (o = fu, qt++) : (o = null, 0 === Wt && e(su)), 
	                null !== o ? (Lt = l, u = hu(t, r), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il)) : (qt = l, l = il);
	            } else qt = l, l = il; else qt = l, l = il;
	            return Wt--, null === l && (u = null, 0 === Wt && e(cu)), l;
	        }
	        function S() {
	            var l, u, t, r;
	            return Wt++, l = qt, u = U(), null !== u ? (45 === n.charCodeAt(qt) ? (t = pu, qt++) : (t = null, 
	            0 === Wt && e(vu)), null !== t ? (r = U(), null !== r ? (Lt = l, u = wu(u, r), null === u ? (qt = l, 
	            l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), Wt--, 
	            null === l && (u = null, 0 === Wt && e(du)), l;
	        }
	        function U() {
	            var n, l;
	            return Wt++, n = G(), null === n && (n = E()), Wt--, null === n && (l = null, 0 === Wt && e(Au)), 
	            n;
	        }
	        function E() {
	            var l, u;
	            return l = qt, Cu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 0 === Wt && e(gu)), 
	            null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function G() {
	            var n;
	            return n = L(), null === n && (n = Y(), null === n && (n = H(), null === n && (n = O(), 
	            null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), null === n && (n = J(), 
	            null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), null === n && (n = V(), 
	            null === n && (n = X(), null === n && (n = _(), null === n && (n = nl(), null === n && (n = ll(), 
	            null === n && (n = ul(), null === n && (n = tl()))))))))))))))))), n;
	        }
	        function B() {
	            var n;
	            return n = j(), null === n && (n = q(), null === n && (n = $())), n;
	        }
	        function j() {
	            var l, u;
	            return l = qt, 46 === n.charCodeAt(qt) ? (u = ku, qt++) : (u = null, 0 === Wt && e(Tu)), 
	            null !== u && (Lt = l, u = xu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function $() {
	            var l, u;
	            return Wt++, l = qt, mu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 
	            0 === Wt && e(Ru)), null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, 
	            Wt--, null === l && (u = null, 0 === Wt && e(yu)), l;
	        }
	        function q() {
	            var n;
	            return n = M(), null === n && (n = D(), null === n && (n = Y(), null === n && (n = H(), 
	            null === n && (n = O(), null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), 
	            null === n && (n = J(), null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), 
	            null === n && (n = V(), null === n && (n = X(), null === n && (n = Z(), null === n && (n = _(), 
	            null === n && (n = nl(), null === n && (n = ll(), null === n && (n = ul(), null === n && (n = tl()))))))))))))))))))), 
	            n;
	        }
	        function L() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), 
	            null !== u && (Lt = l, u = Su()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function M() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), 
	            null !== u && (Lt = l, u = Uu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function D() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Eu ? (u = Eu, qt += 2) : (u = null, 0 === Wt && e(Gu)), 
	            null !== u && (Lt = l, u = Bu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function H() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ju ? (u = ju, qt += 2) : (u = null, 0 === Wt && e($u)), 
	            null !== u && (Lt = l, u = qu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function O() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Lu ? (u = Lu, qt += 2) : (u = null, 0 === Wt && e(Mu)), 
	            null !== u && (Lt = l, u = Du()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function W() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Hu ? (u = Hu, qt += 2) : (u = null, 0 === Wt && e(Ou)), 
	            null !== u && (Lt = l, u = Wu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function z() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === zu ? (u = zu, qt += 2) : (u = null, 0 === Wt && e(Iu)), 
	            null !== u && (Lt = l, u = Ju()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function I() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Ku ? (u = Ku, qt += 2) : (u = null, 0 === Wt && e(Nu)), 
	            null !== u && (Lt = l, u = Pu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function J() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Vu ? (u = Vu, qt += 2) : (u = null, 0 === Wt && e(Xu)), 
	            null !== u && (Lt = l, u = Yu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function K() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Zu ? (u = Zu, qt += 2) : (u = null, 0 === Wt && e(_u)), 
	            null !== u && (Lt = l, u = nt()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function N() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === lt ? (u = lt, qt += 2) : (u = null, 0 === Wt && e(ut)), 
	            null !== u && (Lt = l, u = tt()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function P() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === rt ? (u = rt, qt += 2) : (u = null, 0 === Wt && e(et)), 
	            null !== u && (Lt = l, u = ot()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function V() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ct ? (u = ct, qt += 2) : (u = null, 0 === Wt && e(it)), 
	            null !== u && (Lt = l, u = at()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function X() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ft ? (u = ft, qt += 2) : (u = null, 0 === Wt && e(st)), 
	            null !== u && (Lt = l, u = ht()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function Y() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === dt ? (u = dt, qt += 2) : (u = null, 0 === Wt && e(pt)), 
	            null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), 
	            null !== t ? (Lt = l, u = wt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function Z() {
	            var l, u, t;
	            return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), 
	            null !== u ? (gt.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(bt)), 
	            null !== t ? (Lt = l, u = kt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function _() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), 
	            null !== u) {
	                if (t = [], yt.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(mt)), 
	                null !== r) for (;null !== r; ) t.push(r), yt.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(mt)); else t = il;
	                null !== t ? (Lt = l, u = Rt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function nl() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Ft ? (u = Ft, qt += 2) : (u = null, 0 === Wt && e(Qt)), 
	            null !== u) {
	                if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), 
	                null !== r) for (;null !== r; ) t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(Ut)); else t = il;
	                null !== t ? (Lt = l, u = Et(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function ll() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Gt ? (u = Gt, qt += 2) : (u = null, 0 === Wt && e(Bt)), 
	            null !== u) {
	                if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), 
	                null !== r) for (;null !== r; ) t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(Ut)); else t = il;
	                null !== t ? (Lt = l, u = jt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function ul() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), 
	            null !== u && (Lt = l, u = $t()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function tl() {
	            var l, u, t;
	            return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), 
	            null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), 
	            null !== t ? (Lt = l, u = bu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        var rl, el = arguments.length > 1 ? arguments[1] : {}, ol = {
	            regexp: c
	        }, cl = c, il = null, al = "", fl = "|", sl = '"|"', hl = function(n, l) {
	            return l ? new Alternate(n, l[1]) : n;
	        }, dl = function(n, l, u) {
	            return new Match([ n ].concat(l).concat([ u ]));
	        }, pl = "^", vl = '"^"', wl = function() {
	            return new Token("start");
	        }, Al = "$", Cl = '"$"', gl = function() {
	            return new Token("end");
	        }, bl = function(n, l) {
	            return new Quantified(n, l);
	        }, kl = "Quantifier", Tl = function(n, l) {
	            return l && (n.greedy = !1), n;
	        }, xl = "{", yl = '"{"', ml = ",", Rl = '","', Fl = "}", Ql = '"}"', Sl = function(n, l) {
	            return new Quantifier(n, l);
	        }, Ul = ",}", El = '",}"', Gl = function(n) {
	            return new Quantifier(n, 1/0);
	        }, Bl = function(n) {
	            return new Quantifier(n, n);
	        }, jl = "+", $l = '"+"', ql = function() {
	            return new Quantifier(1, 1/0);
	        }, Ll = "*", Ml = '"*"', Dl = function() {
	            return new Quantifier(0, 1/0);
	        }, Hl = "?", Ol = '"?"', Wl = function() {
	            return new Quantifier(0, 1);
	        }, zl = /^[0-9]/, Il = "[0-9]", Jl = function(n) {
	            return +n.join("");
	        }, Kl = "(", Nl = '"("', Pl = ")", Vl = '")"', Xl = function(n) {
	            return n;
	        }, Yl = function(n) {
	            return new CaptureGroup(n);
	        }, Zl = "?:", _l = '"?:"', nu = function(n) {
	            return new Group("non-capture-group", n);
	        }, lu = "?=", uu = '"?="', tu = function(n) {
	            return new Group("positive-lookahead", n);
	        }, ru = "?!", eu = '"?!"', ou = function(n) {
	            return new Group("negative-lookahead", n);
	        }, cu = "CharacterSet", iu = "[", au = '"["', fu = "]", su = '"]"', hu = function(n, l) {
	            return new CharSet(!!n, l);
	        }, du = "CharacterRange", pu = "-", vu = '"-"', wu = function(n, l) {
	            return new CharacterRange(n, l);
	        }, Au = "Character", Cu = /^[^\\\]]/, gu = "[^\\\\\\]]", bu = function(n) {
	            return new Literal(n);
	        }, ku = ".", Tu = '"."', xu = function() {
	            return new Token("any-character");
	        }, yu = "Literal", mu = /^[^|\\\/.[()?+*$\^]/, Ru = "[^|\\\\\\/.[()?+*$\\^]", Fu = "\\b", Qu = '"\\\\b"', Su = function() {
	            return new Token("backspace");
	        }, Uu = function() {
	            return new Token("word-boundary");
	        }, Eu = "\\B", Gu = '"\\\\B"', Bu = function() {
	            return new Token("non-word-boundary");
	        }, ju = "\\d", $u = '"\\\\d"', qu = function() {
	            return new Token("digit");
	        }, Lu = "\\D", Mu = '"\\\\D"', Du = function() {
	            return new Token("non-digit");
	        }, Hu = "\\f", Ou = '"\\\\f"', Wu = function() {
	            return new Token("form-feed");
	        }, zu = "\\n", Iu = '"\\\\n"', Ju = function() {
	            return new Token("line-feed");
	        }, Ku = "\\r", Nu = '"\\\\r"', Pu = function() {
	            return new Token("carriage-return");
	        }, Vu = "\\s", Xu = '"\\\\s"', Yu = function() {
	            return new Token("white-space");
	        }, Zu = "\\S", _u = '"\\\\S"', nt = function() {
	            return new Token("non-white-space");
	        }, lt = "\\t", ut = '"\\\\t"', tt = function() {
	            return new Token("tab");
	        }, rt = "\\v", et = '"\\\\v"', ot = function() {
	            return new Token("vertical-tab");
	        }, ct = "\\w", it = '"\\\\w"', at = function() {
	            return new Token("word");
	        }, ft = "\\W", st = '"\\\\W"', ht = function() {
	            return new Token("non-word");
	        }, dt = "\\c", pt = '"\\\\c"', vt = "any character", wt = function(n) {
	            return new ControlCharacter(n);
	        }, At = "\\", Ct = '"\\\\"', gt = /^[1-9]/, bt = "[1-9]", kt = function(n) {
	            return new BackReference(n);
	        }, Tt = "\\0", xt = '"\\\\0"', yt = /^[0-7]/, mt = "[0-7]", Rt = function(n) {
	            return new Octal(n.join(""));
	        }, Ft = "\\x", Qt = '"\\\\x"', St = /^[0-9a-fA-F]/, Ut = "[0-9a-fA-F]", Et = function(n) {
	            return new Hex(n.join(""));
	        }, Gt = "\\u", Bt = '"\\\\u"', jt = function(n) {
	            return new Unicode(n.join(""));
	        }, $t = function() {
	            return new Token("null-character");
	        }, qt = 0, Lt = 0, Mt = 0, Dt = {
	            line: 1,
	            column: 1,
	            seenCR: !1
	        }, Ht = 0, Ot = [], Wt = 0;
	        if ("startRule" in el) {
	            if (!(el.startRule in ol)) throw new Error("Can't start parsing from rule \"" + el.startRule + '".');
	            cl = ol[el.startRule];
	        }
	        if (Token.offset = t, Token.text = u, rl = cl(), null !== rl && qt === n.length) return rl;
	        throw o(Ot), Lt = Math.max(qt, Ht), new l(Ot, Lt < n.length ? n.charAt(Lt) : null, Lt, r(Lt).line, r(Lt).column);
	    }
	    return n(l, Error), {
	        SyntaxError: l,
	        parse: u
	    };
	}(), index = 1, cgs = {};

	module.exports = parser

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## RegExp Handler

	    https://github.com/ForbesLindesay/regexp
	    https://github.com/dmajda/pegjs
	    http://www.regexper.com/

	    每个节点的结构
	        {
	            type: '',
	            offset: number,
	            text: '',
	            body: {},
	            escaped: true/false
	        }

	    type 可选值
	        alternate             |         选择
	        match                 匹配
	        capture-group         ()        捕获组
	        non-capture-group     (?:...)   非捕获组
	        positive-lookahead    (?=p)     零宽正向先行断言
	        negative-lookahead    (?!p)     零宽负向先行断言
	        quantified            a*        重复节点
	        quantifier            *         量词
	        charset               []        字符集
	        range                 {m, n}    范围
	        literal               a         直接量字符
	        unicode               \uxxxx    Unicode
	        hex                   \x        十六进制
	        octal                 八进制
	        back-reference        \n        反向引用
	        control-character     \cX       控制字符

	        // Token
	        start               ^       开头
	        end                 $       结尾
	        any-character       .       任意字符
	        backspace           [\b]    退格直接量
	        word-boundary       \b      单词边界
	        non-word-boundary   \B      非单词边界
	        digit               \d      ASCII 数字，[0-9]
	        non-digit           \D      非 ASCII 数字，[^0-9]
	        form-feed           \f      换页符
	        line-feed           \n      换行符
	        carriage-return     \r      回车符
	        white-space         \s      空白符
	        non-white-space     \S      非空白符
	        tab                 \t      制表符
	        vertical-tab        \v      垂直制表符
	        word                \w      ASCII 字符，[a-zA-Z0-9]
	        non-word            \W      非 ASCII 字符，[^a-zA-Z0-9]
	        null-character      \o      NUL 字符
	 */

	var Util = __webpack_require__(3)
	var Random = __webpack_require__(5)
	    /*
	        
	    */
	var Handler = {
	    extend: Util.extend
	}

	// http://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
	/*var ASCII_CONTROL_CODE_CHART = {
	    '@': ['\u0000'],
	    A: ['\u0001'],
	    B: ['\u0002'],
	    C: ['\u0003'],
	    D: ['\u0004'],
	    E: ['\u0005'],
	    F: ['\u0006'],
	    G: ['\u0007', '\a'],
	    H: ['\u0008', '\b'],
	    I: ['\u0009', '\t'],
	    J: ['\u000A', '\n'],
	    K: ['\u000B', '\v'],
	    L: ['\u000C', '\f'],
	    M: ['\u000D', '\r'],
	    N: ['\u000E'],
	    O: ['\u000F'],
	    P: ['\u0010'],
	    Q: ['\u0011'],
	    R: ['\u0012'],
	    S: ['\u0013'],
	    T: ['\u0014'],
	    U: ['\u0015'],
	    V: ['\u0016'],
	    W: ['\u0017'],
	    X: ['\u0018'],
	    Y: ['\u0019'],
	    Z: ['\u001A'],
	    '[': ['\u001B', '\e'],
	    '\\': ['\u001C'],
	    ']': ['\u001D'],
	    '^': ['\u001E'],
	    '_': ['\u001F']
	}*/

	// ASCII printable code chart
	// var LOWER = 'abcdefghijklmnopqrstuvwxyz'
	// var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	// var NUMBER = '0123456789'
	// var SYMBOL = ' !"#$%&\'()*+,-./' + ':;<=>?@' + '[\\]^_`' + '{|}~'
	var LOWER = ascii(97, 122)
	var UPPER = ascii(65, 90)
	var NUMBER = ascii(48, 57)
	var OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126) // 排除 95 _ ascii(91, 94) + ascii(96, 96)
	var PRINTABLE = ascii(32, 126)
	var SPACE = ' \f\n\r\t\v\u00A0\u2028\u2029'
	var CHARACTER_CLASSES = {
	    '\\w': LOWER + UPPER + NUMBER + '_', // ascii(95, 95)
	    '\\W': OTHER.replace('_', ''),
	    '\\s': SPACE,
	    '\\S': function() {
	        var result = PRINTABLE
	        for (var i = 0; i < SPACE.length; i++) {
	            result = result.replace(SPACE[i], '')
	        }
	        return result
	    }(),
	    '\\d': NUMBER,
	    '\\D': LOWER + UPPER + OTHER
	}

	function ascii(from, to) {
	    var result = ''
	    for (var i = from; i <= to; i++) {
	        result += String.fromCharCode(i)
	    }
	    return result
	}

	// var ast = RegExpParser.parse(regexp.source)
	Handler.gen = function(node, result, cache) {
	    cache = cache || {
	        guid: 1
	    }
	    return Handler[node.type] ? Handler[node.type](node, result, cache) :
	        Handler.token(node, result, cache)
	}

	Handler.extend({
	    /* jshint unused:false */
	    token: function(node, result, cache) {
	        switch (node.type) {
	            case 'start':
	            case 'end':
	                return ''
	            case 'any-character':
	                return Random.character()
	            case 'backspace':
	                return ''
	            case 'word-boundary': // TODO
	                return ''
	            case 'non-word-boundary': // TODO
	                break
	            case 'digit':
	                return Random.pick(
	                    NUMBER.split('')
	                )
	            case 'non-digit':
	                return Random.pick(
	                    (LOWER + UPPER + OTHER).split('')
	                )
	            case 'form-feed':
	                break
	            case 'line-feed':
	                return node.body || node.text
	            case 'carriage-return':
	                break
	            case 'white-space':
	                return Random.pick(
	                    SPACE.split('')
	                )
	            case 'non-white-space':
	                return Random.pick(
	                    (LOWER + UPPER + NUMBER).split('')
	                )
	            case 'tab':
	                break
	            case 'vertical-tab':
	                break
	            case 'word': // \w [a-zA-Z0-9]
	                return Random.pick(
	                    (LOWER + UPPER + NUMBER).split('')
	                )
	            case 'non-word': // \W [^a-zA-Z0-9]
	                return Random.pick(
	                    OTHER.replace('_', '').split('')
	                )
	            case 'null-character':
	                break
	        }
	        return node.body || node.text
	    },
	    /*
	        {
	            type: 'alternate',
	            offset: 0,
	            text: '',
	            left: {
	                boyd: []
	            },
	            right: {
	                boyd: []
	            }
	        }
	    */
	    alternate: function(node, result, cache) {
	        // node.left/right {}
	        return this.gen(
	            Random.boolean() ? node.left : node.right,
	            result,
	            cache
	        )
	    },
	    /*
	        {
	            type: 'match',
	            offset: 0,
	            text: '',
	            body: []
	        }
	    */
	    match: function(node, result, cache) {
	        result = ''
	            // node.body []
	        for (var i = 0; i < node.body.length; i++) {
	            result += this.gen(node.body[i], result, cache)
	        }
	        return result
	    },
	    // ()
	    'capture-group': function(node, result, cache) {
	        // node.body {}
	        result = this.gen(node.body, result, cache)
	        cache[cache.guid++] = result
	        return result
	    },
	    // (?:...)
	    'non-capture-group': function(node, result, cache) {
	        // node.body {}
	        return this.gen(node.body, result, cache)
	    },
	    // (?=p)
	    'positive-lookahead': function(node, result, cache) {
	        // node.body
	        return this.gen(node.body, result, cache)
	    },
	    // (?!p)
	    'negative-lookahead': function(node, result, cache) {
	        // node.body
	        return ''
	    },
	    /*
	        {
	            type: 'quantified',
	            offset: 3,
	            text: 'c*',
	            body: {
	                type: 'literal',
	                offset: 3,
	                text: 'c',
	                body: 'c',
	                escaped: false
	            },
	            quantifier: {
	                type: 'quantifier',
	                offset: 4,
	                text: '*',
	                min: 0,
	                max: Infinity,
	                greedy: true
	            }
	        }
	    */
	    quantified: function(node, result, cache) {
	        result = ''
	            // node.quantifier {}
	        var count = this.quantifier(node.quantifier);
	        // node.body {}
	        for (var i = 0; i < count; i++) {
	            result += this.gen(node.body, result, cache)
	        }
	        return result
	    },
	    /*
	        quantifier: {
	            type: 'quantifier',
	            offset: 4,
	            text: '*',
	            min: 0,
	            max: Infinity,
	            greedy: true
	        }
	    */
	    quantifier: function(node, result, cache) {
	        var min = Math.max(node.min, 0)
	        var max = isFinite(node.max) ? node.max :
	            min + Random.integer(3, 7)
	        return Random.integer(min, max)
	    },
	    /*
	        
	    */
	    charset: function(node, result, cache) {
	        // node.invert
	        if (node.invert) return this['invert-charset'](node, result, cache)

	        // node.body []
	        var literal = Random.pick(node.body)
	        return this.gen(literal, result, cache)
	    },
	    'invert-charset': function(node, result, cache) {
	        var pool = PRINTABLE
	        for (var i = 0, item; i < node.body.length; i++) {
	            item = node.body[i]
	            switch (item.type) {
	                case 'literal':
	                    pool = pool.replace(item.body, '')
	                    break
	                case 'range':
	                    var min = this.gen(item.start, result, cache).charCodeAt()
	                    var max = this.gen(item.end, result, cache).charCodeAt()
	                    for (var ii = min; ii <= max; ii++) {
	                        pool = pool.replace(String.fromCharCode(ii), '')
	                    }
	                    /* falls through */
	                default:
	                    var characters = CHARACTER_CLASSES[item.text]
	                    if (characters) {
	                        for (var iii = 0; iii <= characters.length; iii++) {
	                            pool = pool.replace(characters[iii], '')
	                        }
	                    }
	            }
	        }
	        return Random.pick(pool.split(''))
	    },
	    range: function(node, result, cache) {
	        // node.start, node.end
	        var min = this.gen(node.start, result, cache).charCodeAt()
	        var max = this.gen(node.end, result, cache).charCodeAt()
	        return String.fromCharCode(
	            Random.integer(min, max)
	        )
	    },
	    literal: function(node, result, cache) {
	        return node.escaped ? node.body : node.text
	    },
	    // Unicode \u
	    unicode: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 16)
	        )
	    },
	    // 十六进制 \xFF
	    hex: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 16)
	        )
	    },
	    // 八进制 \0
	    octal: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 8)
	        )
	    },
	    // 反向引用
	    'back-reference': function(node, result, cache) {
	        return cache[node.code] || ''
	    },
	    /*
	        http://en.wikipedia.org/wiki/C0_and_C1_control_codes
	    */
	    CONTROL_CHARACTER_MAP: function() {
	        var CONTROL_CHARACTER = '@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _'.split(' ')
	        var CONTROL_CHARACTER_UNICODE = '\u0000 \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \u0008 \u0009 \u000A \u000B \u000C \u000D \u000E \u000F \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001A \u001B \u001C \u001D \u001E \u001F'.split(' ')
	        var map = {}
	        for (var i = 0; i < CONTROL_CHARACTER.length; i++) {
	            map[CONTROL_CHARACTER[i]] = CONTROL_CHARACTER_UNICODE[i]
	        }
	        return map
	    }(),
	    'control-character': function(node, result, cache) {
	        return this.CONTROL_CHARACTER_MAP[node.code]
	    }
	})

	module.exports = Handler

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(24)

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## toJSONSchema

	    把 Mock.js 风格的数据模板转换成 JSON Schema。

	    > [JSON Schema](http://json-schema.org/)
	 */
	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var Parser = __webpack_require__(4)

	function toJSONSchema(template, name, path /* Internal Use Only */ ) {
	    // type rule properties items
	    path = path || []
	    var result = {
	        name: typeof name === 'string' ? name.replace(Constant.RE_KEY, '$1') : name,
	        template: template,
	        type: Util.type(template), // 可能不准确，例如 { 'name|1': [{}, {} ...] }
	        rule: Parser.parse(name)
	    }
	    result.path = path.slice(0)
	    result.path.push(name === undefined ? 'ROOT' : result.name)

	    switch (result.type) {
	        case 'array':
	            result.items = []
	            Util.each(template, function(value, index) {
	                result.items.push(
	                    toJSONSchema(value, index, result.path)
	                )
	            })
	            break
	        case 'object':
	            result.properties = []
	            Util.each(template, function(value, name) {
	                result.properties.push(
	                    toJSONSchema(value, name, result.path)
	                )
	            })
	            break
	    }

	    return result

	}

	module.exports = toJSONSchema


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(26)

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## valid(template, data)

	    校验真实数据 data 是否与数据模板 template 匹配。
	    
	    实现思路：
	    1. 解析规则。
	        先把数据模板 template 解析为更方便机器解析的 JSON-Schame
	        name               属性名 
	        type               属性值类型
	        template           属性值模板
	        properties         对象属性数组
	        items              数组元素数组
	        rule               属性值生成规则
	    2. 递归验证规则。
	        然后用 JSON-Schema 校验真实数据，校验项包括属性名、值类型、值、值生成规则。

	    提示信息 
	    https://github.com/fge/json-schema-validator/blob/master/src/main/resources/com/github/fge/jsonschema/validator/validation.properties
	    [JSON-Schama validator](http://json-schema-validator.herokuapp.com/)
	    [Regexp Demo](http://demos.forbeslindesay.co.uk/regexp/)
	*/
	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var toJSONSchema = __webpack_require__(23)

	function valid(template, data) {
	    var schema = toJSONSchema(template)
	    var result = Diff.diff(schema, data)
	    for (var i = 0; i < result.length; i++) {
	        // console.log(template, data)
	        // console.warn(Assert.message(result[i]))
	    }
	    return result
	}

	/*
	    ## name
	        有生成规则：比较解析后的 name
	        无生成规则：直接比较
	    ## type
	        无类型转换：直接比较
	        有类型转换：先试着解析 template，然后再检查？
	    ## value vs. template
	        基本类型
	            无生成规则：直接比较
	            有生成规则：
	                number
	                    min-max.dmin-dmax
	                    min-max.dcount
	                    count.dmin-dmax
	                    count.dcount
	                    +step
	                    整数部分
	                    小数部分
	                boolean 
	                string  
	                    min-max
	                    count
	    ## properties
	        对象
	            有生成规则：检测期望的属性个数，继续递归
	            无生成规则：检测全部的属性个数，继续递归
	    ## items
	        数组
	            有生成规则：
	                `'name|1': [{}, {} ...]`            其中之一，继续递归
	                `'name|+1': [{}, {} ...]`           顺序检测，继续递归
	                `'name|min-max': [{}, {} ...]`      检测个数，继续递归
	                `'name|count': [{}, {} ...]`        检测个数，继续递归
	            无生成规则：检测全部的元素个数，继续递归
	*/
	var Diff = {
	    diff: function diff(schema, data, name /* Internal Use Only */ ) {
	        var result = []

	        // 先检测名称 name 和类型 type，如果匹配，才有必要继续检测
	        if (
	            this.name(schema, data, name, result) &&
	            this.type(schema, data, name, result)
	        ) {
	            this.value(schema, data, name, result)
	            this.properties(schema, data, name, result)
	            this.items(schema, data, name, result)
	        }

	        return result
	    },
	    /* jshint unused:false */
	    name: function(schema, data, name, result) {
	        var length = result.length

	        Assert.equal('name', schema.path, name + '', schema.name + '', result)

	        return result.length === length
	    },
	    type: function(schema, data, name, result) {
	        var length = result.length

	        switch (schema.type) {
	            case 'string':
	                // 跳过含有『占位符』的属性值，因为『占位符』返回值的类型可能和模板不一致，例如 '@int' 会返回一个整形值
	                if (schema.template.match(Constant.RE_PLACEHOLDER)) return true
	                break
	            case 'array':
	                if (schema.rule.parameters) {
	                    // name|count: array
	                    if (schema.rule.min !== undefined && schema.rule.max === undefined) {
	                        // 跳过 name|1: array，因为最终值的类型（很可能）不是数组，也不一定与 `array` 中的类型一致
	                        if (schema.rule.count === 1) return true
	                    }
	                    // 跳过 name|+inc: array
	                    if (schema.rule.parameters[2]) return true
	                }
	                break
	            case 'function':
	                // 跳过 `'name': function`，因为函数可以返回任何类型的值。
	                return true
	        }

	        Assert.equal('type', schema.path, Util.type(data), schema.type, result)

	        return result.length === length
	    },
	    value: function(schema, data, name, result) {
	        var length = result.length

	        var rule = schema.rule
	        var templateType = schema.type
	        if (templateType === 'object' || templateType === 'array' || templateType === 'function') return true

	        // 无生成规则
	        if (!rule.parameters) {
	            switch (templateType) {
	                case 'regexp':
	                    Assert.match('value', schema.path, data, schema.template, result)
	                    return result.length === length
	                case 'string':
	                    // 同样跳过含有『占位符』的属性值，因为『占位符』的返回值会通常会与模板不一致
	                    if (schema.template.match(Constant.RE_PLACEHOLDER)) return result.length === length
	                    break
	            }
	            Assert.equal('value', schema.path, data, schema.template, result)
	            return result.length === length
	        }

	        // 有生成规则
	        var actualRepeatCount
	        switch (templateType) {
	            case 'number':
	                var parts = (data + '').split('.')
	                parts[0] = +parts[0]

	                // 整数部分
	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('value', schema.path, parts[0], Math.min(rule.min, rule.max), result)
	                        // , 'numeric instance is lower than the required minimum (minimum: {expected}, found: {actual})')
	                    Assert.lessThanOrEqualTo('value', schema.path, parts[0], Math.max(rule.min, rule.max), result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('value', schema.path, parts[0], rule.min, result, '[value] ' + name)
	                }

	                // 小数部分
	                if (rule.decimal) {
	                    // |dmin-dmax
	                    if (rule.dmin !== undefined && rule.dmax !== undefined) {
	                        Assert.greaterThanOrEqualTo('value', schema.path, parts[1].length, rule.dmin, result)
	                        Assert.lessThanOrEqualTo('value', schema.path, parts[1].length, rule.dmax, result)
	                    }
	                    // |dcount
	                    if (rule.dmin !== undefined && rule.dmax === undefined) {
	                        Assert.equal('value', schema.path, parts[1].length, rule.dmin, result)
	                    }
	                }

	                break

	            case 'boolean':
	                break

	            case 'string':
	                // 'aaa'.match(/a/g)
	                actualRepeatCount = data.match(new RegExp(schema.template, 'g'))
	                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0

	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                }

	                break

	            case 'regexp':
	                actualRepeatCount = data.match(new RegExp(schema.template.source.replace(/^\^|\$$/g, ''), 'g'))
	                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0

	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                }
	                break
	        }

	        return result.length === length
	    },
	    properties: function(schema, data, name, result) {
	        var length = result.length

	        var rule = schema.rule
	        var keys = Util.keys(data)
	        if (!schema.properties) return

	        // 无生成规则
	        if (!schema.rule.parameters) {
	            Assert.equal('properties length', schema.path, keys.length, schema.properties.length, result)
	        } else {
	            // 有生成规则
	            // |min-max
	            if (rule.min !== undefined && rule.max !== undefined) {
	                Assert.greaterThanOrEqualTo('properties length', schema.path, keys.length, Math.min(rule.min, rule.max), result)
	                Assert.lessThanOrEqualTo('properties length', schema.path, keys.length, Math.max(rule.min, rule.max), result)
	            }
	            // |count
	            if (rule.min !== undefined && rule.max === undefined) {
	                // |1, |>1
	                if (rule.count !== 1) Assert.equal('properties length', schema.path, keys.length, rule.min, result)
	            }
	        }

	        if (result.length !== length) return false

	        for (var i = 0; i < keys.length; i++) {
	            result.push.apply(
	                result,
	                this.diff(
	                    function() {
	                        var property
	                        Util.each(schema.properties, function(item /*, index*/ ) {
	                            if (item.name === keys[i]) property = item
	                        })
	                        return property || schema.properties[i]
	                    }(),
	                    data[keys[i]],
	                    keys[i]
	                )
	            )
	        }

	        return result.length === length
	    },
	    items: function(schema, data, name, result) {
	        var length = result.length

	        if (!schema.items) return

	        var rule = schema.rule

	        // 无生成规则
	        if (!schema.rule.parameters) {
	            Assert.equal('items length', schema.path, data.length, schema.items.length, result)
	        } else {
	            // 有生成规则
	            // |min-max
	            if (rule.min !== undefined && rule.max !== undefined) {
	                Assert.greaterThanOrEqualTo('items', schema.path, data.length, (Math.min(rule.min, rule.max) * schema.items.length), result,
	                    '[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements')
	                Assert.lessThanOrEqualTo('items', schema.path, data.length, (Math.max(rule.min, rule.max) * schema.items.length), result,
	                    '[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements')
	            }
	            // |count
	            if (rule.min !== undefined && rule.max === undefined) {
	                // |1, |>1
	                if (rule.count === 1) return result.length === length
	                else Assert.equal('items length', schema.path, data.length, (rule.min * schema.items.length), result)
	            }
	            // |+inc
	            if (rule.parameters[2]) return result.length === length
	        }

	        if (result.length !== length) return false

	        for (var i = 0; i < data.length; i++) {
	            result.push.apply(
	                result,
	                this.diff(
	                    schema.items[i % schema.items.length],
	                    data[i],
	                    i % schema.items.length
	                )
	            )
	        }

	        return result.length === length
	    }
	}

	/*
	    完善、友好的提示信息
	    
	    Equal, not equal to, greater than, less than, greater than or equal to, less than or equal to
	    路径 验证类型 描述 

	    Expect path.name is less than or equal to expected, but path.name is actual.

	    Expect path.name is less than or equal to expected, but path.name is actual.
	    Expect path.name is greater than or equal to expected, but path.name is actual.

	*/
	var Assert = {
	    message: function(item) {
	        return (item.message ||
	                '[{utype}] Expect {path}\'{ltype} {action} {expected}, but is {actual}')
	            .replace('{utype}', item.type.toUpperCase())
	            .replace('{ltype}', item.type.toLowerCase())
	            .replace('{path}', Util.isArray(item.path) && item.path.join('.') || item.path)
	            .replace('{action}', item.action)
	            .replace('{expected}', item.expected)
	            .replace('{actual}', item.actual)
	    },
	    equal: function(type, path, actual, expected, result, message) {
	        if (actual === expected) return true
	        switch (type) {
	            case 'type':
	                // 正则模板 === 字符串最终值
	                if (expected === 'regexp' && actual === 'string') return true
	                break
	        }

	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    // actual matches expected
	    match: function(type, path, actual, expected, result, message) {
	        if (expected.test(actual)) return true

	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'matches',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    notEqual: function(type, path, actual, expected, result, message) {
	        if (actual !== expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is not equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    greaterThan: function(type, path, actual, expected, result, message) {
	        if (actual > expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is greater than',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    lessThan: function(type, path, actual, expected, result, message) {
	        if (actual < expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is less to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    greaterThanOrEqualTo: function(type, path, actual, expected, result, message) {
	        if (actual >= expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is greater than or equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    lessThanOrEqualTo: function(type, path, actual, expected, result, message) {
	        if (actual <= expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is less than or equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    }
	}

	valid.Diff = Diff
	valid.Assert = Assert

	module.exports = valid

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(28)

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* global window, document, location, Event, setTimeout */
	/*
	    ## MockXMLHttpRequest

	    期望的功能：
	    1. 完整地覆盖原生 XHR 的行为
	    2. 完整地模拟原生 XHR 的行为
	    3. 在发起请求时，自动检测是否需要拦截
	    4. 如果不必拦截，则执行原生 XHR 的行为
	    5. 如果需要拦截，则执行虚拟 XHR 的行为
	    6. 兼容 XMLHttpRequest 和 ActiveXObject
	        new window.XMLHttpRequest()
	        new window.ActiveXObject("Microsoft.XMLHTTP")

	    关键方法的逻辑：
	    * new   此时尚无法确定是否需要拦截，所以创建原生 XHR 对象是必须的。
	    * open  此时可以取到 URL，可以决定是否进行拦截。
	    * send  此时已经确定了请求方式。

	    规范：
	    http://xhr.spec.whatwg.org/
	    http://www.w3.org/TR/XMLHttpRequest2/

	    参考实现：
	    https://github.com/philikon/MockHttpRequest/blob/master/lib/mock.js
	    https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js
	    https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js
	    https://github.com/firebug/firebug-lite/blob/master/content/lite/xhr.js
	    https://github.com/thx/RAP/blob/master/lab/rap.plugin.xinglie.js

	    **需不需要全面重写 XMLHttpRequest？**
	        http://xhr.spec.whatwg.org/#interface-xmlhttprequest
	        关键属性 readyState、status、statusText、response、responseText、responseXML 是 readonly，所以，试图通过修改这些状态，来模拟响应是不可行的。
	        因此，唯一的办法是模拟整个 XMLHttpRequest，就像 jQuery 对事件模型的封装。

	    // Event handlers
	    onloadstart         loadstart
	    onprogress          progress
	    onabort             abort
	    onerror             error
	    onload              load
	    ontimeout           timeout
	    onloadend           loadend
	    onreadystatechange  readystatechange
	 */

	var Util = __webpack_require__(3)

	// 备份原生 XMLHttpRequest
	window._XMLHttpRequest = window.XMLHttpRequest
	window._ActiveXObject = window.ActiveXObject

	/*
	    PhantomJS
	    TypeError: '[object EventConstructor]' is not a constructor (evaluating 'new Event("readystatechange")')

	    https://github.com/bluerail/twitter-bootstrap-rails-confirm/issues/18
	    https://github.com/ariya/phantomjs/issues/11289
	*/
	try {
	    new window.Event('custom')
	} catch (exception) {
	    window.Event = function(type, bubbles, cancelable, detail) {
	        var event = document.createEvent('CustomEvent') // MUST be 'CustomEvent'
	        event.initCustomEvent(type, bubbles, cancelable, detail)
	        return event
	    }
	}

	var XHR_STATES = {
	    // The object has been constructed.
	    UNSENT: 0,
	    // The open() method has been successfully invoked.
	    OPENED: 1,
	    // All redirects (if any) have been followed and all HTTP headers of the response have been received.
	    HEADERS_RECEIVED: 2,
	    // The response's body is being received.
	    LOADING: 3,
	    // The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
	    DONE: 4
	}

	var XHR_EVENTS = 'readystatechange loadstart progress abort error load timeout loadend'.split(' ')
	var XHR_REQUEST_PROPERTIES = 'timeout withCredentials'.split(' ')
	var XHR_RESPONSE_PROPERTIES = 'readyState responseURL status statusText responseType response responseText responseXML'.split(' ')

	// https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js#L32
	var HTTP_STATUS_CODES = {
	    100: "Continue",
	    101: "Switching Protocols",
	    200: "OK",
	    201: "Created",
	    202: "Accepted",
	    203: "Non-Authoritative Information",
	    204: "No Content",
	    205: "Reset Content",
	    206: "Partial Content",
	    300: "Multiple Choice",
	    301: "Moved Permanently",
	    302: "Found",
	    303: "See Other",
	    304: "Not Modified",
	    305: "Use Proxy",
	    307: "Temporary Redirect",
	    400: "Bad Request",
	    401: "Unauthorized",
	    402: "Payment Required",
	    403: "Forbidden",
	    404: "Not Found",
	    405: "Method Not Allowed",
	    406: "Not Acceptable",
	    407: "Proxy Authentication Required",
	    408: "Request Timeout",
	    409: "Conflict",
	    410: "Gone",
	    411: "Length Required",
	    412: "Precondition Failed",
	    413: "Request Entity Too Large",
	    414: "Request-URI Too Long",
	    415: "Unsupported Media Type",
	    416: "Requested Range Not Satisfiable",
	    417: "Expectation Failed",
	    422: "Unprocessable Entity",
	    500: "Internal Server Error",
	    501: "Not Implemented",
	    502: "Bad Gateway",
	    503: "Service Unavailable",
	    504: "Gateway Timeout",
	    505: "HTTP Version Not Supported"
	}

	/*
	    MockXMLHttpRequest
	*/

	function MockXMLHttpRequest() {
	    // 初始化 custom 对象，用于存储自定义属性
	    this.custom = {
	        events: {},
	        requestHeaders: {},
	        responseHeaders: {}
	    }
	}

	MockXMLHttpRequest._settings = {
	    timeout: '10-100',
	    /*
	        timeout: 50,
	        timeout: '10-100',
	     */
	}

	MockXMLHttpRequest.setup = function(settings) {
	    Util.extend(MockXMLHttpRequest._settings, settings)
	    return MockXMLHttpRequest._settings
	}

	Util.extend(MockXMLHttpRequest, XHR_STATES)
	Util.extend(MockXMLHttpRequest.prototype, XHR_STATES)

	// 标记当前对象为 MockXMLHttpRequest
	MockXMLHttpRequest.prototype.mock = true

	// 是否拦截 Ajax 请求
	MockXMLHttpRequest.prototype.match = false

	// 初始化 Request 相关的属性和方法
	Util.extend(MockXMLHttpRequest.prototype, {
	    // https://xhr.spec.whatwg.org/#the-open()-method
	    // Sets the request method, request URL, and synchronous flag.
	    open: function(method, url, async, username, password) {
	        var that = this

	        Util.extend(this.custom, {
	            method: method,
	            url: url,
	            async: typeof async === 'boolean' ? async : true,
	            username: username,
	            password: password,
	            options: {
	                url: url,
	                type: method
	            }
	        })

	        this.custom.timeout = function(timeout) {
	            if (typeof timeout === 'number') return timeout
	            if (typeof timeout === 'string' && !~timeout.indexOf('-')) return parseInt(timeout, 10)
	            if (typeof timeout === 'string' && ~timeout.indexOf('-')) {
	                var tmp = timeout.split('-')
	                var min = parseInt(tmp[0], 10)
	                var max = parseInt(tmp[1], 10)
	                return Math.round(Math.random() * (max - min)) + min
	            }
	        }(MockXMLHttpRequest._settings.timeout)

	        // 查找与请求参数匹配的数据模板
	        var item = find(this.custom.options)

	        function handle(event) {
	            // 同步属性 NativeXMLHttpRequest => MockXMLHttpRequest
	            for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
	                try {
	                    that[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]]
	                } catch (e) {}
	            }
	            // 触发 MockXMLHttpRequest 上的同名事件
	            that.dispatchEvent(new Event(event.type /*, false, false, that*/ ))
	        }

	        // 如果未找到匹配的数据模板，则采用原生 XHR 发送请求。
	        if (!item) {
	            // 创建原生 XHR 对象，调用原生 open()，监听所有原生事件
	            var xhr = createNativeXMLHttpRequest()
	            this.custom.xhr = xhr

	            // 初始化所有事件，用于监听原生 XHR 对象的事件
	            for (var i = 0; i < XHR_EVENTS.length; i++) {
	                xhr.addEventListener(XHR_EVENTS[i], handle)
	            }

	            // xhr.open()
	            if (username) xhr.open(method, url, async, username, password)
	            else xhr.open(method, url, async)

	            // 同步属性 MockXMLHttpRequest => NativeXMLHttpRequest
	            for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
	                try {
	                    xhr[XHR_REQUEST_PROPERTIES[j]] = that[XHR_REQUEST_PROPERTIES[j]]
	                } catch (e) {}
	            }

	            return
	        }

	        // 找到了匹配的数据模板，开始拦截 XHR 请求
	        this.match = true
	        this.custom.template = item
	        this.readyState = MockXMLHttpRequest.OPENED
	        this.dispatchEvent(new Event('readystatechange' /*, false, false, this*/ ))
	    },
	    // https://xhr.spec.whatwg.org/#the-setrequestheader()-method
	    // Combines a header in author request headers.
	    setRequestHeader: function(name, value) {
	        // 原生 XHR
	        if (!this.match) {
	            this.custom.xhr.setRequestHeader(name, value)
	            return
	        }

	        // 拦截 XHR
	        var requestHeaders = this.custom.requestHeaders
	        if (requestHeaders[name]) requestHeaders[name] += ',' + value
	        else requestHeaders[name] = value
	    },
	    timeout: 0,
	    withCredentials: false,
	    upload: {},
	    // https://xhr.spec.whatwg.org/#the-send()-method
	    // Initiates the request.
	    send: function send(data) {
	        var that = this
	        this.custom.options.body = data

	        // 原生 XHR
	        if (!this.match) {
	            this.custom.xhr.send(data)
	            return
	        }

	        // 拦截 XHR

	        // X-Requested-With header
	        this.setRequestHeader('X-Requested-With', 'MockXMLHttpRequest')

	        // loadstart The fetch initiates.
	        this.dispatchEvent(new Event('loadstart' /*, false, false, this*/ ))

	        if (this.custom.async) setTimeout(done, this.custom.timeout) // 异步
	        else done() // 同步

	        function done() {
	            that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
	            that.readyState = MockXMLHttpRequest.LOADING
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))

	            that.status = 200
	            that.statusText = HTTP_STATUS_CODES[200]

	            // fix #92 #93 by @qddegtya
	            that.response = that.responseText = JSON.stringify(
	                convert(that.custom.template, that.custom.options),
	                null, 4
	            )

	            that.readyState = MockXMLHttpRequest.DONE
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
	            that.dispatchEvent(new Event('load' /*, false, false, that*/ ));
	            that.dispatchEvent(new Event('loadend' /*, false, false, that*/ ));
	        }
	    },
	    // https://xhr.spec.whatwg.org/#the-abort()-method
	    // Cancels any network activity.
	    abort: function abort() {
	        // 原生 XHR
	        if (!this.match) {
	            this.custom.xhr.abort()
	            return
	        }

	        // 拦截 XHR
	        this.readyState = MockXMLHttpRequest.UNSENT
	        this.dispatchEvent(new Event('abort', false, false, this))
	        this.dispatchEvent(new Event('error', false, false, this))
	    }
	})

	// 初始化 Response 相关的属性和方法
	Util.extend(MockXMLHttpRequest.prototype, {
	    responseURL: '',
	    status: MockXMLHttpRequest.UNSENT,
	    statusText: '',
	    // https://xhr.spec.whatwg.org/#the-getresponseheader()-method
	    getResponseHeader: function(name) {
	        // 原生 XHR
	        if (!this.match) {
	            return this.custom.xhr.getResponseHeader(name)
	        }

	        // 拦截 XHR
	        return this.custom.responseHeaders[name.toLowerCase()]
	    },
	    // https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
	    // http://www.utf8-chartable.de/
	    getAllResponseHeaders: function() {
	        // 原生 XHR
	        if (!this.match) {
	            return this.custom.xhr.getAllResponseHeaders()
	        }

	        // 拦截 XHR
	        var responseHeaders = this.custom.responseHeaders
	        var headers = ''
	        for (var h in responseHeaders) {
	            if (!responseHeaders.hasOwnProperty(h)) continue
	            headers += h + ': ' + responseHeaders[h] + '\r\n'
	        }
	        return headers
	    },
	    overrideMimeType: function( /*mime*/ ) {},
	    responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json'
	    response: null,
	    responseText: '',
	    responseXML: null
	})

	// EventTarget
	Util.extend(MockXMLHttpRequest.prototype, {
	    addEventListener: function addEventListener(type, handle) {
	        var events = this.custom.events
	        if (!events[type]) events[type] = []
	        events[type].push(handle)
	    },
	    removeEventListener: function removeEventListener(type, handle) {
	        var handles = this.custom.events[type] || []
	        for (var i = 0; i < handles.length; i++) {
	            if (handles[i] === handle) {
	                handles.splice(i--, 1)
	            }
	        }
	    },
	    dispatchEvent: function dispatchEvent(event) {
	        var handles = this.custom.events[event.type] || []
	        for (var i = 0; i < handles.length; i++) {
	            handles[i].call(this, event)
	        }

	        var ontype = 'on' + event.type
	        if (this[ontype]) this[ontype](event)
	    }
	})

	// Inspired by jQuery
	function createNativeXMLHttpRequest() {
	    var isLocal = function() {
	        var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
	        var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
	        var ajaxLocation = location.href
	        var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
	        return rlocalProtocol.test(ajaxLocParts[1])
	    }()

	    return window.ActiveXObject ?
	        (!isLocal && createStandardXHR() || createActiveXHR()) : createStandardXHR()

	    function createStandardXHR() {
	        try {
	            return new window._XMLHttpRequest();
	        } catch (e) {}
	    }

	    function createActiveXHR() {
	        try {
	            return new window._ActiveXObject("Microsoft.XMLHTTP");
	        } catch (e) {}
	    }
	}


	// 查找与请求参数匹配的数据模板：URL，Type
	function find(options) {

	    for (var sUrlType in MockXMLHttpRequest.Mock._mocked) {
	        var item = MockXMLHttpRequest.Mock._mocked[sUrlType]
	        if (
	            (!item.rurl || match(item.rurl, options.url)) &&
	            (!item.rtype || match(item.rtype, options.type.toLowerCase()))
	        ) {
	            // console.log('[mock]', options.url, '>', item.rurl)
	            return item
	        }
	    }

	    function match(expected, actual) {
	        if (Util.type(expected) === 'string') {
	            return expected === actual
	        }
	        if (Util.type(expected) === 'regexp') {
	            return expected.test(actual)
	        }
	    }

	}

	// 数据模板 ＝> 响应数据
	function convert(item, options) {
	    return Util.isFunction(item.template) ?
	        item.template(options) : MockXMLHttpRequest.Mock.mock(item.template)
	}

	module.exports = MockXMLHttpRequest

/***/ }
/******/ ])
});
;

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(111);

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(112);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = __webpack_require__(115);

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = __webpack_require__(126);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = __webpack_require__(153);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(154);

var _createClass3 = _interopRequireDefault(_createClass2);

__webpack_require__(158);

var _index = __webpack_require__(162);

var _index2 = _interopRequireDefault(_index);

var _axios = __webpack_require__(180);

var _axios2 = _interopRequireDefault(_axios);

var _graphql = __webpack_require__(199);

__webpack_require__(221);

__webpack_require__(222);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Main = function () {
  function Main() {
    var _this = this;

    (0, _classCallCheck3.default)(this, Main);

    this.getIndexList().then(function (res) {
      _this.render(res, _index2.default);
    });
  }

  (0, _createClass3.default)(Main, [{
    key: 'render',
    value: function render(context, template) {
      // 渲染数据到页面
      document.querySelector('#app').innerHTML = template(context);
    }
  }, {
    key: 'getIndexList',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var articleList, authorList, i, authorId, j;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.fetchArticleListAsync();

              case 2:
                articleList = _context.sent;
                _context.next = 5;
                return this.fetchAuthorListAsync();

              case 5:
                authorList = _context.sent;
                i = 0;

              case 7:
                if (!(i < articleList.length)) {
                  _context.next = 20;
                  break;
                }

                authorId = articleList[i].authorId;
                j = 0;

              case 10:
                if (!(j < authorList.length)) {
                  _context.next = 17;
                  break;
                }

                if (!(authorList[j].id == authorId)) {
                  _context.next = 14;
                  break;
                }

                articleList[i].author = (0, _assign2.default)({}, authorList[j]);
                return _context.abrupt('break', 17);

              case 14:
                j++;
                _context.next = 10;
                break;

              case 17:
                i++;
                _context.next = 7;
                break;

              case 20:
                return _context.abrupt('return', { list: articleList });

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getIndexList() {
        return _ref.apply(this, arguments);
      }

      return getIndexList;
    }()
  }, {
    key: 'fetchArticleListAsync',
    value: function fetchArticleListAsync() {
      return _axios2.default.get("/graphql/articleList").then(function (res) {
        return res.data.list;
      });
    }
  }, {
    key: 'fetchAuthorListAsync',
    value: function fetchAuthorListAsync() {
      return _axios2.default.get("/graphql/authorList").then(function (res) {
        return res.data.list;
      });
    }
  }]);
  return Main;
}();

new Main();

// let schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `)
// let root = { hello: () => 'Hello world!' }
// graphql(schema, '{hello}', root)
//   .then(res => {
//     console.log(res)
//   })

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(113);


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(114);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(37)))

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(37)))

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(116), __esModule: true };

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(117);
module.exports = __webpack_require__(13).Object.assign;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(29);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(120)});

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(18) && !__webpack_require__(39)(function(){
  return Object.defineProperty(__webpack_require__(40)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(31);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(59)
  , gOPS     = __webpack_require__(124)
  , pIE      = __webpack_require__(125)
  , toObject = __webpack_require__(65)
  , IObject  = __webpack_require__(60)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(39)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(32)
  , toIObject    = __webpack_require__(41)
  , arrayIndexOf = __webpack_require__(122)(false)
  , IE_PROTO     = __webpack_require__(44)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(41)
  , toLength  = __webpack_require__(61)
  , toIndex   = __webpack_require__(123);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(43)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 124 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 125 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(127);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(128), __esModule: true };

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(129);
__webpack_require__(130);
__webpack_require__(137);
__webpack_require__(141);
module.exports = __webpack_require__(13).Promise;

/***/ }),
/* 129 */
/***/ (function(module, exports) {



/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(131)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(66)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(43)
  , defined   = __webpack_require__(42);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(134)
  , descriptor     = __webpack_require__(58)
  , setToStringTag = __webpack_require__(45)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(16)(IteratorPrototype, __webpack_require__(5)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(17)
  , dPs         = __webpack_require__(135)
  , enumBugKeys = __webpack_require__(64)
  , IE_PROTO    = __webpack_require__(44)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(40)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(68).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(22)
  , anObject = __webpack_require__(17)
  , getKeys  = __webpack_require__(59);

module.exports = __webpack_require__(18) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(32)
  , toObject    = __webpack_require__(65)
  , IE_PROTO    = __webpack_require__(44)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(138);
var global        = __webpack_require__(6)
  , hide          = __webpack_require__(16)
  , Iterators     = __webpack_require__(23)
  , TO_STRING_TAG = __webpack_require__(5)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(139)
  , step             = __webpack_require__(140)
  , Iterators        = __webpack_require__(23)
  , toIObject        = __webpack_require__(41);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(66)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 139 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 140 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(67)
  , global             = __webpack_require__(6)
  , ctx                = __webpack_require__(30)
  , classof            = __webpack_require__(69)
  , $export            = __webpack_require__(29)
  , isObject           = __webpack_require__(31)
  , aFunction          = __webpack_require__(38)
  , anInstance         = __webpack_require__(142)
  , forOf              = __webpack_require__(143)
  , speciesConstructor = __webpack_require__(147)
  , task               = __webpack_require__(70).set
  , microtask          = __webpack_require__(149)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(150)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(45)($Promise, PROMISE);
__webpack_require__(151)(PROMISE);
Wrapper = __webpack_require__(13)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(152)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 142 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(30)
  , call        = __webpack_require__(144)
  , isArrayIter = __webpack_require__(145)
  , anObject    = __webpack_require__(17)
  , toLength    = __webpack_require__(61)
  , getIterFn   = __webpack_require__(146)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(17);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(23)
  , ITERATOR   = __webpack_require__(5)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(69)
  , ITERATOR  = __webpack_require__(5)('iterator')
  , Iterators = __webpack_require__(23);
module.exports = __webpack_require__(13).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(17)
  , aFunction = __webpack_require__(38)
  , SPECIES   = __webpack_require__(5)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 148 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(6)
  , macrotask = __webpack_require__(70).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(33)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(16);
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(6)
  , core        = __webpack_require__(13)
  , dP          = __webpack_require__(22)
  , DESCRIPTORS = __webpack_require__(18)
  , SPECIES     = __webpack_require__(5)('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(5)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(155);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(156), __esModule: true };

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(157);
var $Object = __webpack_require__(13).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(29);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(18), 'Object', {defineProperty: __webpack_require__(22).f});

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(160)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(46, function() {
			var newContent = __webpack_require__(46);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 159 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(161);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 161 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var Handlebars = __webpack_require__(163);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.escapeExpression, alias2=container.lambda;

  return "    <li class=\"item\">\r\n      <span> "
    + alias1(__default(__webpack_require__(179)).call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"helpers/getIndex","hash":{},"data":data}))
    + " .</span>\r\n      <h2> \r\n        "
    + alias1(alias2((depth0 != null ? depth0.title : depth0), depth0))
    + " \r\n        (<span> "
    + alias1(alias2((depth0 != null ? depth0.source : depth0), depth0))
    + " </span>)\r\n      </h2>\r\n      <p>Write by "
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.name : stack1), depth0))
    + " </p>\r\n    </li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"home-container\">\r\n  <h1 class=\"news\">Hacker News "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.username : depth0), depth0))
    + " </h1>\r\n  <ul class=\"list\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\r\n</div>";
},"useData":true});

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = __webpack_require__(164)['default'];


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = __webpack_require__(71);

var base = _interopRequireWildcard(_handlebarsBase);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _handlebarsSafeString = __webpack_require__(176);

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = __webpack_require__(24);

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = __webpack_require__(8);

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = __webpack_require__(177);

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = __webpack_require__(178);

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9oYW5kbGViYXJzLnJ1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OEJBQXNCLG1CQUFtQjs7SUFBN0IsSUFBSTs7Ozs7b0NBSU8sMEJBQTBCOzs7O21DQUMzQix3QkFBd0I7Ozs7K0JBQ3ZCLG9CQUFvQjs7SUFBL0IsS0FBSzs7aUNBQ1Esc0JBQXNCOztJQUFuQyxPQUFPOztvQ0FFSSwwQkFBMEI7Ozs7O0FBR2pELFNBQVMsTUFBTSxHQUFHO0FBQ2hCLE1BQUksRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0FBRTFDLE9BQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUUsQ0FBQyxVQUFVLG9DQUFhLENBQUM7QUFDM0IsSUFBRSxDQUFDLFNBQVMsbUNBQVksQ0FBQztBQUN6QixJQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNqQixJQUFFLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDOztBQUU3QyxJQUFFLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztBQUNoQixJQUFFLENBQUMsUUFBUSxHQUFHLFVBQVMsSUFBSSxFQUFFO0FBQzNCLFdBQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDbkMsQ0FBQzs7QUFFRixTQUFPLEVBQUUsQ0FBQztDQUNYOztBQUVELElBQUksSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixrQ0FBVyxJQUFJLENBQUMsQ0FBQzs7QUFFakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQzs7cUJBRVIsSUFBSSIsImZpbGUiOiJoYW5kbGViYXJzLnJ1bnRpbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4vaGFuZGxlYmFycy9iYXNlJztcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbmltcG9ydCBTYWZlU3RyaW5nIGZyb20gJy4vaGFuZGxlYmFycy9zYWZlLXN0cmluZyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vaGFuZGxlYmFycy9leGNlcHRpb24nO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9oYW5kbGViYXJzL3V0aWxzJztcbmltcG9ydCAqIGFzIHJ1bnRpbWUgZnJvbSAnLi9oYW5kbGViYXJzL3J1bnRpbWUnO1xuXG5pbXBvcnQgbm9Db25mbGljdCBmcm9tICcuL2hhbmRsZWJhcnMvbm8tY29uZmxpY3QnO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgbGV0IGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcbiAgaGIuZXNjYXBlRXhwcmVzc2lvbiA9IFV0aWxzLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufVxuXG5sZXQgaW5zdCA9IGNyZWF0ZSgpO1xuaW5zdC5jcmVhdGUgPSBjcmVhdGU7XG5cbm5vQ29uZmxpY3QoaW5zdCk7XG5cbmluc3RbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IGluc3Q7XG4iXX0=


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = __webpack_require__(166);

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = __webpack_require__(167);

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = __webpack_require__(168);

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = __webpack_require__(169);

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = __webpack_require__(170);

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = __webpack_require__(171);

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = __webpack_require__(172);

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7eUNBQXVDLGdDQUFnQzs7OzsyQkFDOUMsZ0JBQWdCOzs7O29DQUNQLDBCQUEwQjs7Ozt5QkFDckMsY0FBYzs7OzswQkFDYixlQUFlOzs7OzZCQUNaLGtCQUFrQjs7OzsyQkFDcEIsZ0JBQWdCOzs7O0FBRWxDLFNBQVMsc0JBQXNCLENBQUMsUUFBUSxFQUFFO0FBQy9DLHlDQUEyQixRQUFRLENBQUMsQ0FBQztBQUNyQywyQkFBYSxRQUFRLENBQUMsQ0FBQztBQUN2QixvQ0FBc0IsUUFBUSxDQUFDLENBQUM7QUFDaEMseUJBQVcsUUFBUSxDQUFDLENBQUM7QUFDckIsMEJBQVksUUFBUSxDQUFDLENBQUM7QUFDdEIsNkJBQWUsUUFBUSxDQUFDLENBQUM7QUFDekIsMkJBQWEsUUFBUSxDQUFDLENBQUM7Q0FDeEIiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZWdpc3RlckJsb2NrSGVscGVyTWlzc2luZyBmcm9tICcuL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcnO1xuaW1wb3J0IHJlZ2lzdGVyRWFjaCBmcm9tICcuL2hlbHBlcnMvZWFjaCc7XG5pbXBvcnQgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nIGZyb20gJy4vaGVscGVycy9oZWxwZXItbWlzc2luZyc7XG5pbXBvcnQgcmVnaXN0ZXJJZiBmcm9tICcuL2hlbHBlcnMvaWYnO1xuaW1wb3J0IHJlZ2lzdGVyTG9nIGZyb20gJy4vaGVscGVycy9sb2cnO1xuaW1wb3J0IHJlZ2lzdGVyTG9va3VwIGZyb20gJy4vaGVscGVycy9sb29rdXAnO1xuaW1wb3J0IHJlZ2lzdGVyV2l0aCBmcm9tICcuL2hlbHBlcnMvd2l0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVyQmxvY2tIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJFYWNoKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJJZihpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyTG9nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJMb29rdXAoaW5zdGFuY2UpO1xuICByZWdpc3RlcldpdGgoaW5zdGFuY2UpO1xufVxuIl19


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _utils = __webpack_require__(8);

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztxQkFBc0QsVUFBVTs7cUJBRWpELFVBQVMsUUFBUSxFQUFFO0FBQ2hDLFVBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3ZFLFFBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPO1FBQ3pCLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUVwQixRQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7QUFDcEIsYUFBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakIsTUFBTSxJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUMvQyxhQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QixNQUFNLElBQUksZUFBUSxPQUFPLENBQUMsRUFBRTtBQUMzQixVQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLFlBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUNmLGlCQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCOztBQUVELGVBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQ2hELE1BQU07QUFDTCxlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN0QjtLQUNGLE1BQU07QUFDTCxVQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUMvQixZQUFJLElBQUksR0FBRyxtQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsWUFBSSxDQUFDLFdBQVcsR0FBRyx5QkFBa0IsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdFLGVBQU8sR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztPQUN4Qjs7QUFFRCxhQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDN0I7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJibG9jay1oZWxwZXItbWlzc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwZW5kQ29udGV4dFBhdGgsIGNyZWF0ZUZyYW1lLCBpc0FycmF5fSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgbGV0IGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmIChjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYgKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICAgICAgICBvcHRpb25zLmlkcyA9IFtvcHRpb25zLm5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGxldCBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5uYW1lKTtcbiAgICAgICAgb3B0aW9ucyA9IHtkYXRhOiBkYXRhfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = __webpack_require__(8);

var _exception = __webpack_require__(24);

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvZWFjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O3FCQUErRSxVQUFVOzt5QkFDbkUsY0FBYzs7OztxQkFFckIsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pELFFBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixZQUFNLDJCQUFjLDZCQUE2QixDQUFDLENBQUM7S0FDcEQ7O0FBRUQsUUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUU7UUFDZixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87UUFDekIsQ0FBQyxHQUFHLENBQUM7UUFDTCxHQUFHLEdBQUcsRUFBRTtRQUNSLElBQUksWUFBQTtRQUNKLFdBQVcsWUFBQSxDQUFDOztBQUVoQixRQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUMvQixpQkFBVyxHQUFHLHlCQUFrQixPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQ2pGOztBQUVELFFBQUksa0JBQVcsT0FBTyxDQUFDLEVBQUU7QUFBRSxhQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUFFOztBQUUxRCxRQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxHQUFHLG1CQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQzs7QUFFRCxhQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN6QyxVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7O0FBRW5CLFlBQUksV0FBVyxFQUFFO0FBQ2YsY0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQ3hDO09BQ0Y7O0FBRUQsU0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzdCLFlBQUksRUFBRSxJQUFJO0FBQ1YsbUJBQVcsRUFBRSxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDL0UsQ0FBQyxDQUFDO0tBQ0o7O0FBRUQsUUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQzFDLFVBQUksZUFBUSxPQUFPLENBQUMsRUFBRTtBQUNwQixhQUFLLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxjQUFJLENBQUMsSUFBSSxPQUFPLEVBQUU7QUFDaEIseUJBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1dBQy9DO1NBQ0Y7T0FDRixNQUFNO0FBQ0wsWUFBSSxRQUFRLFlBQUEsQ0FBQzs7QUFFYixhQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUN2QixjQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7Ozs7QUFJL0IsZ0JBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtBQUMxQiwyQkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEM7QUFDRCxvQkFBUSxHQUFHLEdBQUcsQ0FBQztBQUNmLGFBQUMsRUFBRSxDQUFDO1dBQ0w7U0FDRjtBQUNELFlBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtBQUMxQix1QkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3RDO09BQ0Y7S0FDRjs7QUFFRCxRQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDWCxTQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCOztBQUVELFdBQU8sR0FBRyxDQUFDO0dBQ1osQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiZWFjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwZW5kQ29udGV4dFBhdGgsIGJsb2NrUGFyYW1zLCBjcmVhdGVGcmFtZSwgaXNBcnJheSwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ011c3QgcGFzcyBpdGVyYXRvciB0byAjZWFjaCcpO1xuICAgIH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm4sXG4gICAgICAgIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICByZXQgPSAnJyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29udGV4dFBhdGg7XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICBjb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pICsgJy4nO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWNJdGVyYXRpb24oZmllbGQsIGluZGV4LCBsYXN0KSB7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBkYXRhLmtleSA9IGZpZWxkO1xuICAgICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGRhdGEuZmlyc3QgPSBpbmRleCA9PT0gMDtcbiAgICAgICAgZGF0YS5sYXN0ID0gISFsYXN0O1xuXG4gICAgICAgIGlmIChjb250ZXh0UGF0aCkge1xuICAgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aCArIGZpZWxkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbZmllbGRdLCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dFtmaWVsZF0sIGZpZWxkXSwgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29udGV4dC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJpb3JLZXk7XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBydW5uaW5nIHRoZSBpdGVyYXRpb25zIG9uZSBzdGVwIG91dCBvZiBzeW5jIHNvIHdlIGNhbiBkZXRlY3RcbiAgICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcbiAgICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuXG4gICAgICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvcktleSA9IGtleTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiJdfQ==


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = __webpack_require__(24);

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozt5QkFBc0IsY0FBYzs7OztxQkFFckIsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUUsaUNBQWdDO0FBQ3ZFLFFBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7O0FBRTFCLGFBQU8sU0FBUyxDQUFDO0tBQ2xCLE1BQU07O0FBRUwsWUFBTSwyQkFBYyxtQkFBbUIsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDdkY7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJoZWxwZXItbWlzc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbigvKiBbYXJncywgXW9wdGlvbnMgKi8pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gQSBtaXNzaW5nIGZpZWxkIGluIGEge3tmb299fSBjb25zdHJ1Y3QuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb21lb25lIGlzIGFjdHVhbGx5IHRyeWluZyB0byBjYWxsIHNvbWV0aGluZywgYmxvdyB1cC5cbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ01pc3NpbmcgaGVscGVyOiBcIicgKyBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdLm5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH0pO1xufVxuIl19


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _utils = __webpack_require__(8);

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaWYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztxQkFBa0MsVUFBVTs7cUJBRTdCLFVBQVMsUUFBUSxFQUFFO0FBQ2hDLFVBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVMsV0FBVyxFQUFFLE9BQU8sRUFBRTtBQUMzRCxRQUFJLGtCQUFXLFdBQVcsQ0FBQyxFQUFFO0FBQUUsaUJBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQUU7Ozs7O0FBS3RFLFFBQUksQUFBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxJQUFLLGVBQVEsV0FBVyxDQUFDLEVBQUU7QUFDdkUsYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCLE1BQU07QUFDTCxhQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDekI7R0FDRixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBUyxXQUFXLEVBQUUsT0FBTyxFQUFFO0FBQy9ELFdBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztHQUN2SCxDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJpZi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNFbXB0eSwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcbn1cbiJdfQ==


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQWUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsa0NBQWlDO0FBQzlELFFBQUksSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ2xCLE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QyxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0MsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN6Qjs7QUFFRCxRQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxRQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtBQUM5QixXQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDNUIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3JELFdBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUM1QjtBQUNELFFBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7O0FBRWhCLFlBQVEsQ0FBQyxHQUFHLE1BQUEsQ0FBWixRQUFRLEVBQVMsSUFBSSxDQUFDLENBQUM7R0FDeEIsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoibG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKC8qIG1lc3NhZ2UsIG9wdGlvbnMgKi8pIHtcbiAgICBsZXQgYXJncyA9IFt1bmRlZmluZWRdLFxuICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cblxuICAgIGxldCBsZXZlbCA9IDE7XG4gICAgaWYgKG9wdGlvbnMuaGFzaC5sZXZlbCAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IG9wdGlvbnMuaGFzaC5sZXZlbDtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCkge1xuICAgICAgbGV2ZWwgPSBvcHRpb25zLmRhdGEubGV2ZWw7XG4gICAgfVxuICAgIGFyZ3NbMF0gPSBsZXZlbDtcblxuICAgIGluc3RhbmNlLmxvZyguLi4gYXJncyk7XG4gIH0pO1xufVxuIl19


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9va3VwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQWUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBUyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3JELFdBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMxQixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJsb29rdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9va3VwJywgZnVuY3Rpb24ob2JqLCBmaWVsZCkge1xuICAgIHJldHVybiBvYmogJiYgb2JqW2ZpZWxkXTtcbiAgfSk7XG59XG4iXX0=


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _utils = __webpack_require__(8);

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvd2l0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3FCQUErRSxVQUFVOztxQkFFMUUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pELFFBQUksa0JBQVcsT0FBTyxDQUFDLEVBQUU7QUFBRSxhQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUFFOztBQUUxRCxRQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsZUFBUSxPQUFPLENBQUMsRUFBRTtBQUNyQixVQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3hCLFVBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQy9CLFlBQUksR0FBRyxtQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsWUFBSSxDQUFDLFdBQVcsR0FBRyx5QkFBa0IsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ2hGOztBQUVELGFBQU8sRUFBRSxDQUFDLE9BQU8sRUFBRTtBQUNqQixZQUFJLEVBQUUsSUFBSTtBQUNWLG1CQUFXLEVBQUUsbUJBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDaEUsQ0FBQyxDQUFDO0tBQ0osTUFBTTtBQUNMLGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5QjtHQUNGLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6IndpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FwcGVuZENvbnRleHRQYXRoLCBibG9ja1BhcmFtcywgY3JlYXRlRnJhbWUsIGlzRW1wdHksIGlzRnVuY3Rpb259IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgbGV0IGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmICghaXNFbXB0eShjb250ZXh0KSkge1xuICAgICAgbGV0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dF0sIFtkYXRhICYmIGRhdGEuY29udGV4dFBhdGhdKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = __webpack_require__(174);

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0NBQTJCLHFCQUFxQjs7OztBQUV6QyxTQUFTLHlCQUF5QixDQUFDLFFBQVEsRUFBRTtBQUNsRCxnQ0FBZSxRQUFRLENBQUMsQ0FBQztDQUMxQiIsImZpbGUiOiJkZWNvcmF0b3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlZ2lzdGVySW5saW5lIGZyb20gJy4vZGVjb3JhdG9ycy9pbmxpbmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyhpbnN0YW5jZSkge1xuICByZWdpc3RlcklubGluZShpbnN0YW5jZSk7XG59XG5cbiJdfQ==


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _utils = __webpack_require__(8);

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMvaW5saW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQXFCLFVBQVU7O3FCQUVoQixVQUFTLFFBQVEsRUFBRTtBQUNoQyxVQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFVBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFO0FBQzNFLFFBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ25CLFdBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFNBQUcsR0FBRyxVQUFTLE9BQU8sRUFBRSxPQUFPLEVBQUU7O0FBRS9CLFlBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7QUFDbEMsaUJBQVMsQ0FBQyxRQUFRLEdBQUcsY0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxRCxZQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLGlCQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUM5QixlQUFPLEdBQUcsQ0FBQztPQUNaLENBQUM7S0FDSDs7QUFFRCxTQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUU3QyxXQUFPLEdBQUcsQ0FBQztHQUNaLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6ImlubGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXh0ZW5kfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVyRGVjb3JhdG9yKCdpbmxpbmUnLCBmdW5jdGlvbihmbiwgcHJvcHMsIGNvbnRhaW5lciwgb3B0aW9ucykge1xuICAgIGxldCByZXQgPSBmbjtcbiAgICBpZiAoIXByb3BzLnBhcnRpYWxzKSB7XG4gICAgICBwcm9wcy5wYXJ0aWFscyA9IHt9O1xuICAgICAgcmV0ID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcGFydGlhbHMgc3RhY2sgZnJhbWUgcHJpb3IgdG8gZXhlYy5cbiAgICAgICAgbGV0IG9yaWdpbmFsID0gY29udGFpbmVyLnBhcnRpYWxzO1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBleHRlbmQoe30sIG9yaWdpbmFsLCBwcm9wcy5wYXJ0aWFscyk7XG4gICAgICAgIGxldCByZXQgPSBmbihjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3JpZ2luYWw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHByb3BzLnBhcnRpYWxzW29wdGlvbnMuYXJnc1swXV0gPSBvcHRpb25zLmZuO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG59XG4iXX0=


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _utils = __webpack_require__(8);

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      if (!console[method]) {
        // eslint-disable-line no-console
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3FCQUFzQixTQUFTOztBQUUvQixJQUFJLE1BQU0sR0FBRztBQUNYLFdBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztBQUM3QyxPQUFLLEVBQUUsTUFBTTs7O0FBR2IsYUFBVyxFQUFFLHFCQUFTLEtBQUssRUFBRTtBQUMzQixRQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUM3QixVQUFJLFFBQVEsR0FBRyxlQUFRLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDOUQsVUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO0FBQ2pCLGFBQUssR0FBRyxRQUFRLENBQUM7T0FDbEIsTUFBTTtBQUNMLGFBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQzdCO0tBQ0Y7O0FBRUQsV0FBTyxLQUFLLENBQUM7R0FDZDs7O0FBR0QsS0FBRyxFQUFFLGFBQVMsS0FBSyxFQUFjO0FBQy9CLFNBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsQyxRQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDL0UsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFOztBQUNwQixjQUFNLEdBQUcsS0FBSyxDQUFDO09BQ2hCOzt3Q0FQbUIsT0FBTztBQUFQLGVBQU87OztBQVEzQixhQUFPLENBQUMsTUFBTSxPQUFDLENBQWYsT0FBTyxFQUFZLE9BQU8sQ0FBQyxDQUFDO0tBQzdCO0dBQ0Y7Q0FDRixDQUFDOztxQkFFYSxNQUFNIiwiZmlsZSI6ImxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aW5kZXhPZn0gZnJvbSAnLi91dGlscyc7XG5cbmxldCBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogWydkZWJ1ZycsICdpbmZvJywgJ3dhcm4nLCAnZXJyb3InXSxcbiAgbGV2ZWw6ICdpbmZvJyxcblxuICAvLyBNYXBzIGEgZ2l2ZW4gbGV2ZWwgdmFsdWUgdG8gdGhlIGBtZXRob2RNYXBgIGluZGV4ZXMgYWJvdmUuXG4gIGxvb2t1cExldmVsOiBmdW5jdGlvbihsZXZlbCkge1xuICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgbGV2ZWxNYXAgPSBpbmRleE9mKGxvZ2dlci5tZXRob2RNYXAsIGxldmVsLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgaWYgKGxldmVsTWFwID49IDApIHtcbiAgICAgICAgbGV2ZWwgPSBsZXZlbE1hcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldmVsID0gcGFyc2VJbnQobGV2ZWwsIDEwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGV2ZWw7XG4gIH0sXG5cbiAgLy8gQ2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgLi4ubWVzc2FnZSkge1xuICAgIGxldmVsID0gbG9nZ2VyLmxvb2t1cExldmVsKGxldmVsKTtcblxuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9nZ2VyLmxvb2t1cExldmVsKGxvZ2dlci5sZXZlbCkgPD0gbGV2ZWwpIHtcbiAgICAgIGxldCBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICghY29uc29sZVttZXRob2RdKSB7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIG1ldGhvZCA9ICdsb2cnO1xuICAgICAgfVxuICAgICAgY29uc29sZVttZXRob2RdKC4uLm1lc3NhZ2UpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlcjtcbiJdfQ==


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Build out our basic SafeString type


exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDMUIsTUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Q0FDdEI7O0FBRUQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUN2RSxTQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0NBQ3pCLENBQUM7O3FCQUVhLFVBQVUiLCJmaWxlIjoic2FmZS1zdHJpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gU2FmZVN0cmluZy5wcm90b3R5cGUudG9IVE1MID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnJyArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2FmZVN0cmluZztcbiJdfQ==


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = __webpack_require__(8);

var Utils = _interopRequireWildcard(_utils);

var _exception = __webpack_require__(24);

var _exception2 = _interopRequireDefault(_exception);

var _base = __webpack_require__(71);

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },
    // An empty object to use as replacement for null-contexts
    nullContext: Object.seal({}),

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }
    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = container.merge(options.decorators, env.decorators);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  // Use the current closure context to save the partial-block if this partial
  var currentPartialBlock = options.data && options.data['partial-block'];
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    (function () {
      options.data = _base.createFrame(options.data);
      // Wrapper function to get access to currentPartialBlock from the closure
      var fn = options.fn;
      partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        // Restore the partial-block from the closure for the execution of the block
        // i.e. the part inside the block of the partial call.
        options.data = _base.createFrame(options.data);
        options.data['partial-block'] = currentPartialBlock;
        return fn(context, options);
      };
      if (fn.partials) {
        options.partials = Utils.extend({}, options.partials, fn.partials);
      }
    })();
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQXVCLFNBQVM7O0lBQXBCLEtBQUs7O3lCQUNLLGFBQWE7Ozs7b0JBQzhCLFFBQVE7O0FBRWxFLFNBQVMsYUFBYSxDQUFDLFlBQVksRUFBRTtBQUMxQyxNQUFNLGdCQUFnQixHQUFHLFlBQVksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztNQUN2RCxlQUFlLDBCQUFvQixDQUFDOztBQUUxQyxNQUFJLGdCQUFnQixLQUFLLGVBQWUsRUFBRTtBQUN4QyxRQUFJLGdCQUFnQixHQUFHLGVBQWUsRUFBRTtBQUN0QyxVQUFNLGVBQWUsR0FBRyx1QkFBaUIsZUFBZSxDQUFDO1VBQ25ELGdCQUFnQixHQUFHLHVCQUFpQixnQkFBZ0IsQ0FBQyxDQUFDO0FBQzVELFlBQU0sMkJBQWMseUZBQXlGLEdBQ3ZHLHFEQUFxRCxHQUFHLGVBQWUsR0FBRyxtREFBbUQsR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNoSyxNQUFNOztBQUVMLFlBQU0sMkJBQWMsd0ZBQXdGLEdBQ3RHLGlEQUFpRCxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNuRjtHQUNGO0NBQ0Y7O0FBRU0sU0FBUyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTs7QUFFMUMsTUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLFVBQU0sMkJBQWMsbUNBQW1DLENBQUMsQ0FBQztHQUMxRDtBQUNELE1BQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQ3ZDLFVBQU0sMkJBQWMsMkJBQTJCLEdBQUcsT0FBTyxZQUFZLENBQUMsQ0FBQztHQUN4RTs7QUFFRCxjQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDOzs7O0FBSWxELEtBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFNUMsV0FBUyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN2RCxRQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDaEIsYUFBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsVUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ2YsZUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7T0FDdkI7S0FDRjs7QUFFRCxXQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RFLFFBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFeEUsUUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7QUFDakMsYUFBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN6RixZQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzNEO0FBQ0QsUUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ2xCLFVBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixZQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1QixrQkFBTTtXQUNQOztBQUVELGVBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0QztBQUNELGNBQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzNCO0FBQ0QsYUFBTyxNQUFNLENBQUM7S0FDZixNQUFNO0FBQ0wsWUFBTSwyQkFBYyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRywwREFBMEQsQ0FBQyxDQUFDO0tBQ2pIO0dBQ0Y7OztBQUdELE1BQUksU0FBUyxHQUFHO0FBQ2QsVUFBTSxFQUFFLGdCQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDMUIsVUFBSSxFQUFFLElBQUksSUFBSSxHQUFHLENBQUEsQUFBQyxFQUFFO0FBQ2xCLGNBQU0sMkJBQWMsR0FBRyxHQUFHLElBQUksR0FBRyxtQkFBbUIsR0FBRyxHQUFHLENBQUMsQ0FBQztPQUM3RDtBQUNELGFBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xCO0FBQ0QsVUFBTSxFQUFFLGdCQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDN0IsVUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMxQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVCLFlBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDeEMsaUJBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hCO09BQ0Y7S0FDRjtBQUNELFVBQU0sRUFBRSxnQkFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ2pDLGFBQU8sT0FBTyxPQUFPLEtBQUssVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0tBQ3hFOztBQUVELG9CQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7QUFDeEMsaUJBQWEsRUFBRSxvQkFBb0I7O0FBRW5DLE1BQUUsRUFBRSxZQUFTLENBQUMsRUFBRTtBQUNkLFVBQUksR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixTQUFHLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDdkMsYUFBTyxHQUFHLENBQUM7S0FDWjs7QUFFRCxZQUFRLEVBQUUsRUFBRTtBQUNaLFdBQU8sRUFBRSxpQkFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7QUFDbkUsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7VUFDakMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsVUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLFdBQVcsSUFBSSxtQkFBbUIsRUFBRTtBQUN4RCxzQkFBYyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzNGLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUMxQixzQkFBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDOUQ7QUFDRCxhQUFPLGNBQWMsQ0FBQztLQUN2Qjs7QUFFRCxRQUFJLEVBQUUsY0FBUyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzNCLGFBQU8sS0FBSyxJQUFJLEtBQUssRUFBRSxFQUFFO0FBQ3ZCLGFBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO09BQ3ZCO0FBQ0QsYUFBTyxLQUFLLENBQUM7S0FDZDtBQUNELFNBQUssRUFBRSxlQUFTLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDN0IsVUFBSSxHQUFHLEdBQUcsS0FBSyxJQUFJLE1BQU0sQ0FBQzs7QUFFMUIsVUFBSSxLQUFLLElBQUksTUFBTSxJQUFLLEtBQUssS0FBSyxNQUFNLEFBQUMsRUFBRTtBQUN6QyxXQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3ZDOztBQUVELGFBQU8sR0FBRyxDQUFDO0tBQ1o7O0FBRUQsZUFBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDOztBQUU1QixRQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJO0FBQ2pCLGdCQUFZLEVBQUUsWUFBWSxDQUFDLFFBQVE7R0FDcEMsQ0FBQzs7QUFFRixXQUFTLEdBQUcsQ0FBQyxPQUFPLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOztBQUNoQyxRQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDOztBQUV4QixPQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUU7QUFDNUMsVUFBSSxHQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDaEM7QUFDRCxRQUFJLE1BQU0sWUFBQTtRQUNOLFdBQVcsR0FBRyxZQUFZLENBQUMsY0FBYyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUM7QUFDL0QsUUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFO0FBQzFCLFVBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixjQUFNLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7T0FDM0YsTUFBTTtBQUNMLGNBQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ3BCO0tBQ0Y7O0FBRUQsYUFBUyxJQUFJLENBQUMsT0FBTyxnQkFBZTtBQUNsQyxhQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDckg7QUFDRCxRQUFJLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN0RyxXQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDL0I7QUFDRCxLQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFakIsS0FBRyxDQUFDLE1BQU0sR0FBRyxVQUFTLE9BQU8sRUFBRTtBQUM3QixRQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUNwQixlQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRWxFLFVBQUksWUFBWSxDQUFDLFVBQVUsRUFBRTtBQUMzQixpQkFBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ3RFO0FBQ0QsVUFBSSxZQUFZLENBQUMsVUFBVSxJQUFJLFlBQVksQ0FBQyxhQUFhLEVBQUU7QUFDekQsaUJBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUM1RTtLQUNGLE1BQU07QUFDTCxlQUFTLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDcEMsZUFBUyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3RDLGVBQVMsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztLQUMzQztHQUNGLENBQUM7O0FBRUYsS0FBRyxDQUFDLE1BQU0sR0FBRyxVQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRTtBQUNsRCxRQUFJLFlBQVksQ0FBQyxjQUFjLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDL0MsWUFBTSwyQkFBYyx3QkFBd0IsQ0FBQyxDQUFDO0tBQy9DO0FBQ0QsUUFBSSxZQUFZLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JDLFlBQU0sMkJBQWMseUJBQXlCLENBQUMsQ0FBQztLQUNoRDs7QUFFRCxXQUFPLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztHQUNqRixDQUFDO0FBQ0YsU0FBTyxHQUFHLENBQUM7Q0FDWjs7QUFFTSxTQUFTLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRTtBQUM1RixXQUFTLElBQUksQ0FBQyxPQUFPLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOztBQUNqQyxRQUFJLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDM0IsUUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sS0FBSyxTQUFTLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUEsQUFBQyxFQUFFO0FBQ2hHLG1CQUFhLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUM7O0FBRUQsV0FBTyxFQUFFLENBQUMsU0FBUyxFQUNmLE9BQU8sRUFDUCxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQ3JDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxFQUNwQixXQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUN4RCxhQUFhLENBQUMsQ0FBQztHQUNwQjs7QUFFRCxNQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQzs7QUFFekUsTUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDakIsTUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDeEMsTUFBSSxDQUFDLFdBQVcsR0FBRyxtQkFBbUIsSUFBSSxDQUFDLENBQUM7QUFDNUMsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFTSxTQUFTLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN4RCxNQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osUUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLGdCQUFnQixFQUFFO0FBQ3JDLGFBQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3pDLE1BQU07QUFDTCxhQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUM7R0FDRixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTs7QUFFekMsV0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7QUFDdkIsV0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDckM7QUFDRCxTQUFPLE9BQU8sQ0FBQztDQUNoQjs7QUFFTSxTQUFTLGFBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTs7QUFFdkQsTUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDMUUsU0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDdkIsTUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ2YsV0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztHQUN2RTs7QUFFRCxNQUFJLFlBQVksWUFBQSxDQUFDO0FBQ2pCLE1BQUksT0FBTyxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsRUFBRSxLQUFLLElBQUksRUFBRTs7QUFDckMsYUFBTyxDQUFDLElBQUksR0FBRyxrQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpDLFVBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7QUFDcEIsa0JBQVksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLFNBQVMsbUJBQW1CLENBQUMsT0FBTyxFQUFnQjtZQUFkLE9BQU8seURBQUcsRUFBRTs7OztBQUkvRixlQUFPLENBQUMsSUFBSSxHQUFHLGtCQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxlQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO0FBQ3BELGVBQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUM3QixDQUFDO0FBQ0YsVUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0FBQ2YsZUFBTyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNwRTs7R0FDRjs7QUFFRCxNQUFJLE9BQU8sS0FBSyxTQUFTLElBQUksWUFBWSxFQUFFO0FBQ3pDLFdBQU8sR0FBRyxZQUFZLENBQUM7R0FDeEI7O0FBRUQsTUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO0FBQ3pCLFVBQU0sMkJBQWMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUMsQ0FBQztHQUM1RSxNQUFNLElBQUksT0FBTyxZQUFZLFFBQVEsRUFBRTtBQUN0QyxXQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDbEM7Q0FDRjs7QUFFTSxTQUFTLElBQUksR0FBRztBQUFFLFNBQU8sRUFBRSxDQUFDO0NBQUU7O0FBRXJDLFNBQVMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDL0IsTUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLE1BQU0sSUFBSSxJQUFJLENBQUEsQUFBQyxFQUFFO0FBQzlCLFFBQUksR0FBRyxJQUFJLEdBQUcsa0JBQVksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0dBQ3JCO0FBQ0QsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO0FBQ3pFLE1BQUksRUFBRSxDQUFDLFNBQVMsRUFBRTtBQUNoQixRQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixRQUFJLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUYsU0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDM0I7QUFDRCxTQUFPLElBQUksQ0FBQztDQUNiIiwiZmlsZSI6InJ1bnRpbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi9leGNlcHRpb24nO1xuaW1wb3J0IHsgQ09NUElMRVJfUkVWSVNJT04sIFJFVklTSU9OX0NIQU5HRVMsIGNyZWF0ZUZyYW1lIH0gZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG4gIGNvbnN0IGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdIHx8IDEsXG4gICAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgY29uc3QgcnVudGltZVZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgICAgICAgY29tcGlsZXJWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY29tcGlsZXJSZXZpc2lvbl07XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiAnICtcbiAgICAgICAgICAgICdQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uICgnICsgcnVudGltZVZlcnNpb25zICsgJykgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uICgnICsgY29tcGlsZXJWZXJzaW9ucyArICcpLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1RlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uICgnICsgY29tcGlsZXJJbmZvWzFdICsgJykuJyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ05vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZScpO1xuICB9XG4gIGlmICghdGVtcGxhdGVTcGVjIHx8ICF0ZW1wbGF0ZVNwZWMubWFpbikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1Vua25vd24gdGVtcGxhdGUgb2JqZWN0OiAnICsgdHlwZW9mIHRlbXBsYXRlU3BlYyk7XG4gIH1cblxuICB0ZW1wbGF0ZVNwZWMubWFpbi5kZWNvcmF0b3IgPSB0ZW1wbGF0ZVNwZWMubWFpbl9kO1xuXG4gIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG4gIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc3VlZG8tc3VwcG9ydGVkIEFQSXMuXG4gIGVudi5WTS5jaGVja1JldmlzaW9uKHRlbXBsYXRlU3BlYy5jb21waWxlcik7XG5cbiAgZnVuY3Rpb24gaW52b2tlUGFydGlhbFdyYXBwZXIocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICAgIGNvbnRleHQgPSBVdGlscy5leHRlbmQoe30sIGNvbnRleHQsIG9wdGlvbnMuaGFzaCk7XG4gICAgICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICAgICAgb3B0aW9ucy5pZHNbMF0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnRpYWwgPSBlbnYuVk0ucmVzb2x2ZVBhcnRpYWwuY2FsbCh0aGlzLCBwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgICBsZXQgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuY2FsbCh0aGlzLCBwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKTtcblxuICAgIGlmIChyZXN1bHQgPT0gbnVsbCAmJiBlbnYuY29tcGlsZSkge1xuICAgICAgb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgdGVtcGxhdGVTcGVjLmNvbXBpbGVyT3B0aW9ucywgZW52KTtcbiAgICAgIHJlc3VsdCA9IG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICBpZiAob3B0aW9ucy5pbmRlbnQpIHtcbiAgICAgICAgbGV0IGxpbmVzID0gcmVzdWx0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoIWxpbmVzW2ldICYmIGkgKyAxID09PSBsKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaW5lc1tpXSA9IG9wdGlvbnMuaW5kZW50ICsgbGluZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdUaGUgcGFydGlhbCAnICsgb3B0aW9ucy5uYW1lICsgJyBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gSnVzdCBhZGQgd2F0ZXJcbiAgbGV0IGNvbnRhaW5lciA9IHtcbiAgICBzdHJpY3Q6IGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICAgICAgaWYgKCEobmFtZSBpbiBvYmopKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1wiJyArIG5hbWUgKyAnXCIgbm90IGRlZmluZWQgaW4gJyArIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqW25hbWVdO1xuICAgIH0sXG4gICAgbG9va3VwOiBmdW5jdGlvbihkZXB0aHMsIG5hbWUpIHtcbiAgICAgIGNvbnN0IGxlbiA9IGRlcHRocy5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChkZXB0aHNbaV0gJiYgZGVwdGhzW2ldW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZGVwdGhzW2ldW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBsYW1iZGE6IGZ1bmN0aW9uKGN1cnJlbnQsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgY3VycmVudCA9PT0gJ2Z1bmN0aW9uJyA/IGN1cnJlbnQuY2FsbChjb250ZXh0KSA6IGN1cnJlbnQ7XG4gICAgfSxcblxuICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG4gICAgaW52b2tlUGFydGlhbDogaW52b2tlUGFydGlhbFdyYXBwZXIsXG5cbiAgICBmbjogZnVuY3Rpb24oaSkge1xuICAgICAgbGV0IHJldCA9IHRlbXBsYXRlU3BlY1tpXTtcbiAgICAgIHJldC5kZWNvcmF0b3IgPSB0ZW1wbGF0ZVNwZWNbaSArICdfZCddO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgcHJvZ3JhbXM6IFtdLFxuICAgIHByb2dyYW06IGZ1bmN0aW9uKGksIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgICAgIGxldCBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0sXG4gICAgICAgICAgZm4gPSB0aGlzLmZuKGkpO1xuICAgICAgaWYgKGRhdGEgfHwgZGVwdGhzIHx8IGJsb2NrUGFyYW1zIHx8IGRlY2xhcmVkQmxvY2tQYXJhbXMpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB3cmFwUHJvZ3JhbSh0aGlzLCBpLCBmbiwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSB3cmFwUHJvZ3JhbSh0aGlzLCBpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uKHZhbHVlLCBkZXB0aCkge1xuICAgICAgd2hpbGUgKHZhbHVlICYmIGRlcHRoLS0pIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5fcGFyZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKHBhcmFtLCBjb21tb24pIHtcbiAgICAgIGxldCBvYmogPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgKHBhcmFtICE9PSBjb21tb24pKSB7XG4gICAgICAgIG9iaiA9IFV0aWxzLmV4dGVuZCh7fSwgY29tbW9uLCBwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcbiAgICAvLyBBbiBlbXB0eSBvYmplY3QgdG8gdXNlIGFzIHJlcGxhY2VtZW50IGZvciBudWxsLWNvbnRleHRzXG4gICAgbnVsbENvbnRleHQ6IE9iamVjdC5zZWFsKHt9KSxcblxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogdGVtcGxhdGVTcGVjLmNvbXBpbGVyXG4gIH07XG5cbiAgZnVuY3Rpb24gcmV0KGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBkYXRhID0gb3B0aW9ucy5kYXRhO1xuXG4gICAgcmV0Ll9zZXR1cChvcHRpb25zKTtcbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCAmJiB0ZW1wbGF0ZVNwZWMudXNlRGF0YSkge1xuICAgICAgZGF0YSA9IGluaXREYXRhKGNvbnRleHQsIGRhdGEpO1xuICAgIH1cbiAgICBsZXQgZGVwdGhzLFxuICAgICAgICBibG9ja1BhcmFtcyA9IHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyA/IFtdIDogdW5kZWZpbmVkO1xuICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlRGVwdGhzKSB7XG4gICAgICBpZiAob3B0aW9ucy5kZXB0aHMpIHtcbiAgICAgICAgZGVwdGhzID0gY29udGV4dCAhPSBvcHRpb25zLmRlcHRoc1swXSA/IFtjb250ZXh0XS5jb25jYXQob3B0aW9ucy5kZXB0aHMpIDogb3B0aW9ucy5kZXB0aHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXB0aHMgPSBbY29udGV4dF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFpbihjb250ZXh0LyosIG9wdGlvbnMqLykge1xuICAgICAgcmV0dXJuICcnICsgdGVtcGxhdGVTcGVjLm1haW4oY29udGFpbmVyLCBjb250ZXh0LCBjb250YWluZXIuaGVscGVycywgY29udGFpbmVyLnBhcnRpYWxzLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcbiAgICB9XG4gICAgbWFpbiA9IGV4ZWN1dGVEZWNvcmF0b3JzKHRlbXBsYXRlU3BlYy5tYWluLCBtYWluLCBjb250YWluZXIsIG9wdGlvbnMuZGVwdGhzIHx8IFtdLCBkYXRhLCBibG9ja1BhcmFtcyk7XG4gICAgcmV0dXJuIG1haW4oY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0LmlzVG9wID0gdHJ1ZTtcblxuICByZXQuX3NldHVwID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBjb250YWluZXIuaGVscGVycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmhlbHBlcnMsIGVudi5oZWxwZXJzKTtcblxuICAgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VQYXJ0aWFsKSB7XG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLnBhcnRpYWxzLCBlbnYucGFydGlhbHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VQYXJ0aWFsIHx8IHRlbXBsYXRlU3BlYy51c2VEZWNvcmF0b3JzKSB7XG4gICAgICAgIGNvbnRhaW5lci5kZWNvcmF0b3JzID0gY29udGFpbmVyLm1lcmdlKG9wdGlvbnMuZGVjb3JhdG9ycywgZW52LmRlY29yYXRvcnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIuaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IG9wdGlvbnMuZGVjb3JhdG9ycztcbiAgICB9XG4gIH07XG5cbiAgcmV0Ll9jaGlsZCA9IGZ1bmN0aW9uKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZUJsb2NrUGFyYW1zICYmICFibG9ja1BhcmFtcykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIGJsb2NrIHBhcmFtcycpO1xuICAgIH1cbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocyAmJiAhZGVwdGhzKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdtdXN0IHBhc3MgcGFyZW50IGRlcHRocycpO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwUHJvZ3JhbShjb250YWluZXIsIGksIHRlbXBsYXRlU3BlY1tpXSwgZGF0YSwgMCwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG4gIH07XG4gIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwUHJvZ3JhbShjb250YWluZXIsIGksIGZuLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gIGZ1bmN0aW9uIHByb2coY29udGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGN1cnJlbnREZXB0aHMgPSBkZXB0aHM7XG4gICAgaWYgKGRlcHRocyAmJiBjb250ZXh0ICE9IGRlcHRoc1swXSAmJiAhKGNvbnRleHQgPT09IGNvbnRhaW5lci5udWxsQ29udGV4dCAmJiBkZXB0aHNbMF0gPT09IG51bGwpKSB7XG4gICAgICBjdXJyZW50RGVwdGhzID0gW2NvbnRleHRdLmNvbmNhdChkZXB0aHMpO1xuICAgIH1cblxuICAgIHJldHVybiBmbihjb250YWluZXIsXG4gICAgICAgIGNvbnRleHQsXG4gICAgICAgIGNvbnRhaW5lci5oZWxwZXJzLCBjb250YWluZXIucGFydGlhbHMsXG4gICAgICAgIG9wdGlvbnMuZGF0YSB8fCBkYXRhLFxuICAgICAgICBibG9ja1BhcmFtcyAmJiBbb3B0aW9ucy5ibG9ja1BhcmFtc10uY29uY2F0KGJsb2NrUGFyYW1zKSxcbiAgICAgICAgY3VycmVudERlcHRocyk7XG4gIH1cblxuICBwcm9nID0gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcyk7XG5cbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGRlcHRocyA/IGRlcHRocy5sZW5ndGggOiAwO1xuICBwcm9nLmJsb2NrUGFyYW1zID0gZGVjbGFyZWRCbG9ja1BhcmFtcyB8fCAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYXJ0aWFsKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFwYXJ0aWFsKSB7XG4gICAgaWYgKG9wdGlvbnMubmFtZSA9PT0gJ0BwYXJ0aWFsLWJsb2NrJykge1xuICAgICAgcGFydGlhbCA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdO1xuICAgIH1cbiAgfSBlbHNlIGlmICghcGFydGlhbC5jYWxsICYmICFvcHRpb25zLm5hbWUpIHtcbiAgICAvLyBUaGlzIGlzIGEgZHluYW1pYyBwYXJ0aWFsIHRoYXQgcmV0dXJuZWQgYSBzdHJpbmdcbiAgICBvcHRpb25zLm5hbWUgPSBwYXJ0aWFsO1xuICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW3BhcnRpYWxdO1xuICB9XG4gIHJldHVybiBwYXJ0aWFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIC8vIFVzZSB0aGUgY3VycmVudCBjbG9zdXJlIGNvbnRleHQgdG8gc2F2ZSB0aGUgcGFydGlhbC1ibG9jayBpZiB0aGlzIHBhcnRpYWxcbiAgY29uc3QgY3VycmVudFBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXTtcbiAgb3B0aW9ucy5wYXJ0aWFsID0gdHJ1ZTtcbiAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoID0gb3B0aW9ucy5pZHNbMF0gfHwgb3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoO1xuICB9XG5cbiAgbGV0IHBhcnRpYWxCbG9jaztcbiAgaWYgKG9wdGlvbnMuZm4gJiYgb3B0aW9ucy5mbiAhPT0gbm9vcCkge1xuICAgIG9wdGlvbnMuZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgLy8gV3JhcHBlciBmdW5jdGlvbiB0byBnZXQgYWNjZXNzIHRvIGN1cnJlbnRQYXJ0aWFsQmxvY2sgZnJvbSB0aGUgY2xvc3VyZVxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm47XG4gICAgcGFydGlhbEJsb2NrID0gb3B0aW9ucy5kYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBmdW5jdGlvbiBwYXJ0aWFsQmxvY2tXcmFwcGVyKGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgICAvLyBSZXN0b3JlIHRoZSBwYXJ0aWFsLWJsb2NrIGZyb20gdGhlIGNsb3N1cmUgZm9yIHRoZSBleGVjdXRpb24gb2YgdGhlIGJsb2NrXG4gICAgICAvLyBpLmUuIHRoZSBwYXJ0IGluc2lkZSB0aGUgYmxvY2sgb2YgdGhlIHBhcnRpYWwgY2FsbC5cbiAgICAgIG9wdGlvbnMuZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgICBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXSA9IGN1cnJlbnRQYXJ0aWFsQmxvY2s7XG4gICAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfTtcbiAgICBpZiAoZm4ucGFydGlhbHMpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHMgPSBVdGlscy5leHRlbmQoe30sIG9wdGlvbnMucGFydGlhbHMsIGZuLnBhcnRpYWxzKTtcbiAgICB9XG4gIH1cblxuICBpZiAocGFydGlhbCA9PT0gdW5kZWZpbmVkICYmIHBhcnRpYWxCbG9jaykge1xuICAgIHBhcnRpYWwgPSBwYXJ0aWFsQmxvY2s7XG4gIH1cblxuICBpZiAocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGZvdW5kJyk7XG4gIH0gZWxzZSBpZiAocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7IHJldHVybiAnJzsgfVxuXG5mdW5jdGlvbiBpbml0RGF0YShjb250ZXh0LCBkYXRhKSB7XG4gIGlmICghZGF0YSB8fCAhKCdyb290JyBpbiBkYXRhKSkge1xuICAgIGRhdGEgPSBkYXRhID8gY3JlYXRlRnJhbWUoZGF0YSkgOiB7fTtcbiAgICBkYXRhLnJvb3QgPSBjb250ZXh0O1xuICB9XG4gIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKSB7XG4gIGlmIChmbi5kZWNvcmF0b3IpIHtcbiAgICBsZXQgcHJvcHMgPSB7fTtcbiAgICBwcm9nID0gZm4uZGVjb3JhdG9yKHByb2csIHByb3BzLCBjb250YWluZXIsIGRlcHRocyAmJiBkZXB0aHNbMF0sIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICAgIFV0aWxzLmV4dGVuZChwcm9nLCBwcm9wcyk7XG4gIH1cbiAgcmV0dXJuIHByb2c7XG59XG4iXX0=


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* global window */


exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUNlLFVBQVMsVUFBVSxFQUFFOztBQUVsQyxNQUFJLElBQUksR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLE1BQU07TUFDdEQsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7O0FBRWxDLFlBQVUsQ0FBQyxVQUFVLEdBQUcsWUFBVztBQUNqQyxRQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO0FBQ2xDLFVBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0tBQy9CO0FBQ0QsV0FBTyxVQUFVLENBQUM7R0FDbkIsQ0FBQztDQUNIIiwiZmlsZSI6Im5vLWNvbmZsaWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdpbmRvdyAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oSGFuZGxlYmFycykge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBsZXQgcm9vdCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93LFxuICAgICAgJEhhbmRsZWJhcnMgPSByb290LkhhbmRsZWJhcnM7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIEhhbmRsZWJhcnMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyb290LkhhbmRsZWJhcnMgPT09IEhhbmRsZWJhcnMpIHtcbiAgICAgIHJvb3QuSGFuZGxlYmFycyA9ICRIYW5kbGViYXJzO1xuICAgIH1cbiAgICByZXR1cm4gSGFuZGxlYmFycztcbiAgfTtcbn1cbiJdfQ==

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(37)))

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  return parseInt(options.data.index) + 1;
};

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(181);

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var bind = __webpack_require__(72);
var Axios = __webpack_require__(183);
var defaults = __webpack_require__(47);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(77);
axios.CancelToken = __webpack_require__(197);
axios.isCancel = __webpack_require__(76);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(198);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 182 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(47);
var utils = __webpack_require__(4);
var InterceptorManager = __webpack_require__(192);
var dispatchRequest = __webpack_require__(193);
var isAbsoluteURL = __webpack_require__(195);
var combineURLs = __webpack_require__(196);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(75);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);
var transformData = __webpack_require__(194);
var isCancel = __webpack_require__(76);
var defaults = __webpack_require__(47);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(77);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = __webpack_require__(200);

Object.defineProperty(exports, 'graphql', {
  enumerable: true,
  get: function get() {
    return _graphql.graphql;
  }
});

var _type = __webpack_require__(204);

Object.defineProperty(exports, 'GraphQLSchema', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLSchema;
  }
});
Object.defineProperty(exports, 'GraphQLScalarType', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLScalarType;
  }
});
Object.defineProperty(exports, 'GraphQLObjectType', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLObjectType;
  }
});
Object.defineProperty(exports, 'GraphQLInterfaceType', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLInterfaceType;
  }
});
Object.defineProperty(exports, 'GraphQLUnionType', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLUnionType;
  }
});
Object.defineProperty(exports, 'GraphQLEnumType', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLEnumType;
  }
});
Object.defineProperty(exports, 'GraphQLInputObjectType', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLInputObjectType;
  }
});
Object.defineProperty(exports, 'GraphQLList', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLList;
  }
});
Object.defineProperty(exports, 'GraphQLNonNull', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLNonNull;
  }
});
Object.defineProperty(exports, 'GraphQLDirective', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLDirective;
  }
});
Object.defineProperty(exports, 'TypeKind', {
  enumerable: true,
  get: function get() {
    return _type.TypeKind;
  }
});
Object.defineProperty(exports, 'DirectiveLocation', {
  enumerable: true,
  get: function get() {
    return _type.DirectiveLocation;
  }
});
Object.defineProperty(exports, 'GraphQLInt', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLInt;
  }
});
Object.defineProperty(exports, 'GraphQLFloat', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLFloat;
  }
});
Object.defineProperty(exports, 'GraphQLString', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLString;
  }
});
Object.defineProperty(exports, 'GraphQLBoolean', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLBoolean;
  }
});
Object.defineProperty(exports, 'GraphQLID', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLID;
  }
});
Object.defineProperty(exports, 'specifiedDirectives', {
  enumerable: true,
  get: function get() {
    return _type.specifiedDirectives;
  }
});
Object.defineProperty(exports, 'GraphQLIncludeDirective', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLIncludeDirective;
  }
});
Object.defineProperty(exports, 'GraphQLSkipDirective', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLSkipDirective;
  }
});
Object.defineProperty(exports, 'GraphQLDeprecatedDirective', {
  enumerable: true,
  get: function get() {
    return _type.GraphQLDeprecatedDirective;
  }
});
Object.defineProperty(exports, 'DEFAULT_DEPRECATION_REASON', {
  enumerable: true,
  get: function get() {
    return _type.DEFAULT_DEPRECATION_REASON;
  }
});
Object.defineProperty(exports, 'SchemaMetaFieldDef', {
  enumerable: true,
  get: function get() {
    return _type.SchemaMetaFieldDef;
  }
});
Object.defineProperty(exports, 'TypeMetaFieldDef', {
  enumerable: true,
  get: function get() {
    return _type.TypeMetaFieldDef;
  }
});
Object.defineProperty(exports, 'TypeNameMetaFieldDef', {
  enumerable: true,
  get: function get() {
    return _type.TypeNameMetaFieldDef;
  }
});
Object.defineProperty(exports, '__Schema', {
  enumerable: true,
  get: function get() {
    return _type.__Schema;
  }
});
Object.defineProperty(exports, '__Directive', {
  enumerable: true,
  get: function get() {
    return _type.__Directive;
  }
});
Object.defineProperty(exports, '__DirectiveLocation', {
  enumerable: true,
  get: function get() {
    return _type.__DirectiveLocation;
  }
});
Object.defineProperty(exports, '__Type', {
  enumerable: true,
  get: function get() {
    return _type.__Type;
  }
});
Object.defineProperty(exports, '__Field', {
  enumerable: true,
  get: function get() {
    return _type.__Field;
  }
});
Object.defineProperty(exports, '__InputValue', {
  enumerable: true,
  get: function get() {
    return _type.__InputValue;
  }
});
Object.defineProperty(exports, '__EnumValue', {
  enumerable: true,
  get: function get() {
    return _type.__EnumValue;
  }
});
Object.defineProperty(exports, '__TypeKind', {
  enumerable: true,
  get: function get() {
    return _type.__TypeKind;
  }
});
Object.defineProperty(exports, 'isType', {
  enumerable: true,
  get: function get() {
    return _type.isType;
  }
});
Object.defineProperty(exports, 'isInputType', {
  enumerable: true,
  get: function get() {
    return _type.isInputType;
  }
});
Object.defineProperty(exports, 'isOutputType', {
  enumerable: true,
  get: function get() {
    return _type.isOutputType;
  }
});
Object.defineProperty(exports, 'isLeafType', {
  enumerable: true,
  get: function get() {
    return _type.isLeafType;
  }
});
Object.defineProperty(exports, 'isCompositeType', {
  enumerable: true,
  get: function get() {
    return _type.isCompositeType;
  }
});
Object.defineProperty(exports, 'isAbstractType', {
  enumerable: true,
  get: function get() {
    return _type.isAbstractType;
  }
});
Object.defineProperty(exports, 'isNamedType', {
  enumerable: true,
  get: function get() {
    return _type.isNamedType;
  }
});
Object.defineProperty(exports, 'assertType', {
  enumerable: true,
  get: function get() {
    return _type.assertType;
  }
});
Object.defineProperty(exports, 'assertInputType', {
  enumerable: true,
  get: function get() {
    return _type.assertInputType;
  }
});
Object.defineProperty(exports, 'assertOutputType', {
  enumerable: true,
  get: function get() {
    return _type.assertOutputType;
  }
});
Object.defineProperty(exports, 'assertLeafType', {
  enumerable: true,
  get: function get() {
    return _type.assertLeafType;
  }
});
Object.defineProperty(exports, 'assertCompositeType', {
  enumerable: true,
  get: function get() {
    return _type.assertCompositeType;
  }
});
Object.defineProperty(exports, 'assertAbstractType', {
  enumerable: true,
  get: function get() {
    return _type.assertAbstractType;
  }
});
Object.defineProperty(exports, 'assertNamedType', {
  enumerable: true,
  get: function get() {
    return _type.assertNamedType;
  }
});
Object.defineProperty(exports, 'getNullableType', {
  enumerable: true,
  get: function get() {
    return _type.getNullableType;
  }
});
Object.defineProperty(exports, 'getNamedType', {
  enumerable: true,
  get: function get() {
    return _type.getNamedType;
  }
});

var _language = __webpack_require__(205);

Object.defineProperty(exports, 'Source', {
  enumerable: true,
  get: function get() {
    return _language.Source;
  }
});
Object.defineProperty(exports, 'getLocation', {
  enumerable: true,
  get: function get() {
    return _language.getLocation;
  }
});
Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _language.parse;
  }
});
Object.defineProperty(exports, 'parseValue', {
  enumerable: true,
  get: function get() {
    return _language.parseValue;
  }
});
Object.defineProperty(exports, 'parseType', {
  enumerable: true,
  get: function get() {
    return _language.parseType;
  }
});
Object.defineProperty(exports, 'print', {
  enumerable: true,
  get: function get() {
    return _language.print;
  }
});
Object.defineProperty(exports, 'visit', {
  enumerable: true,
  get: function get() {
    return _language.visit;
  }
});
Object.defineProperty(exports, 'visitInParallel', {
  enumerable: true,
  get: function get() {
    return _language.visitInParallel;
  }
});
Object.defineProperty(exports, 'visitWithTypeInfo', {
  enumerable: true,
  get: function get() {
    return _language.visitWithTypeInfo;
  }
});
Object.defineProperty(exports, 'getVisitFn', {
  enumerable: true,
  get: function get() {
    return _language.getVisitFn;
  }
});
Object.defineProperty(exports, 'Kind', {
  enumerable: true,
  get: function get() {
    return _language.Kind;
  }
});
Object.defineProperty(exports, 'TokenKind', {
  enumerable: true,
  get: function get() {
    return _language.TokenKind;
  }
});
Object.defineProperty(exports, 'BREAK', {
  enumerable: true,
  get: function get() {
    return _language.BREAK;
  }
});

var _execution = __webpack_require__(206);

Object.defineProperty(exports, 'execute', {
  enumerable: true,
  get: function get() {
    return _execution.execute;
  }
});
Object.defineProperty(exports, 'defaultFieldResolver', {
  enumerable: true,
  get: function get() {
    return _execution.defaultFieldResolver;
  }
});
Object.defineProperty(exports, 'responsePathAsArray', {
  enumerable: true,
  get: function get() {
    return _execution.responsePathAsArray;
  }
});
Object.defineProperty(exports, 'getDirectiveValues', {
  enumerable: true,
  get: function get() {
    return _execution.getDirectiveValues;
  }
});

var _subscription = __webpack_require__(207);

Object.defineProperty(exports, 'subscribe', {
  enumerable: true,
  get: function get() {
    return _subscription.subscribe;
  }
});
Object.defineProperty(exports, 'createSourceEventStream', {
  enumerable: true,
  get: function get() {
    return _subscription.createSourceEventStream;
  }
});

var _validation = __webpack_require__(210);

Object.defineProperty(exports, 'validate', {
  enumerable: true,
  get: function get() {
    return _validation.validate;
  }
});
Object.defineProperty(exports, 'ValidationContext', {
  enumerable: true,
  get: function get() {
    return _validation.ValidationContext;
  }
});
Object.defineProperty(exports, 'specifiedRules', {
  enumerable: true,
  get: function get() {
    return _validation.specifiedRules;
  }
});
Object.defineProperty(exports, 'ArgumentsOfCorrectTypeRule', {
  enumerable: true,
  get: function get() {
    return _validation.ArgumentsOfCorrectTypeRule;
  }
});
Object.defineProperty(exports, 'DefaultValuesOfCorrectTypeRule', {
  enumerable: true,
  get: function get() {
    return _validation.DefaultValuesOfCorrectTypeRule;
  }
});
Object.defineProperty(exports, 'FieldsOnCorrectTypeRule', {
  enumerable: true,
  get: function get() {
    return _validation.FieldsOnCorrectTypeRule;
  }
});
Object.defineProperty(exports, 'FragmentsOnCompositeTypesRule', {
  enumerable: true,
  get: function get() {
    return _validation.FragmentsOnCompositeTypesRule;
  }
});
Object.defineProperty(exports, 'KnownArgumentNamesRule', {
  enumerable: true,
  get: function get() {
    return _validation.KnownArgumentNamesRule;
  }
});
Object.defineProperty(exports, 'KnownDirectivesRule', {
  enumerable: true,
  get: function get() {
    return _validation.KnownDirectivesRule;
  }
});
Object.defineProperty(exports, 'KnownFragmentNamesRule', {
  enumerable: true,
  get: function get() {
    return _validation.KnownFragmentNamesRule;
  }
});
Object.defineProperty(exports, 'KnownTypeNamesRule', {
  enumerable: true,
  get: function get() {
    return _validation.KnownTypeNamesRule;
  }
});
Object.defineProperty(exports, 'LoneAnonymousOperationRule', {
  enumerable: true,
  get: function get() {
    return _validation.LoneAnonymousOperationRule;
  }
});
Object.defineProperty(exports, 'NoFragmentCyclesRule', {
  enumerable: true,
  get: function get() {
    return _validation.NoFragmentCyclesRule;
  }
});
Object.defineProperty(exports, 'NoUndefinedVariablesRule', {
  enumerable: true,
  get: function get() {
    return _validation.NoUndefinedVariablesRule;
  }
});
Object.defineProperty(exports, 'NoUnusedFragmentsRule', {
  enumerable: true,
  get: function get() {
    return _validation.NoUnusedFragmentsRule;
  }
});
Object.defineProperty(exports, 'NoUnusedVariablesRule', {
  enumerable: true,
  get: function get() {
    return _validation.NoUnusedVariablesRule;
  }
});
Object.defineProperty(exports, 'OverlappingFieldsCanBeMergedRule', {
  enumerable: true,
  get: function get() {
    return _validation.OverlappingFieldsCanBeMergedRule;
  }
});
Object.defineProperty(exports, 'PossibleFragmentSpreadsRule', {
  enumerable: true,
  get: function get() {
    return _validation.PossibleFragmentSpreadsRule;
  }
});
Object.defineProperty(exports, 'ProvidedNonNullArgumentsRule', {
  enumerable: true,
  get: function get() {
    return _validation.ProvidedNonNullArgumentsRule;
  }
});
Object.defineProperty(exports, 'ScalarLeafsRule', {
  enumerable: true,
  get: function get() {
    return _validation.ScalarLeafsRule;
  }
});
Object.defineProperty(exports, 'SingleFieldSubscriptionsRule', {
  enumerable: true,
  get: function get() {
    return _validation.SingleFieldSubscriptionsRule;
  }
});
Object.defineProperty(exports, 'UniqueArgumentNamesRule', {
  enumerable: true,
  get: function get() {
    return _validation.UniqueArgumentNamesRule;
  }
});
Object.defineProperty(exports, 'UniqueDirectivesPerLocationRule', {
  enumerable: true,
  get: function get() {
    return _validation.UniqueDirectivesPerLocationRule;
  }
});
Object.defineProperty(exports, 'UniqueFragmentNamesRule', {
  enumerable: true,
  get: function get() {
    return _validation.UniqueFragmentNamesRule;
  }
});
Object.defineProperty(exports, 'UniqueInputFieldNamesRule', {
  enumerable: true,
  get: function get() {
    return _validation.UniqueInputFieldNamesRule;
  }
});
Object.defineProperty(exports, 'UniqueOperationNamesRule', {
  enumerable: true,
  get: function get() {
    return _validation.UniqueOperationNamesRule;
  }
});
Object.defineProperty(exports, 'UniqueVariableNamesRule', {
  enumerable: true,
  get: function get() {
    return _validation.UniqueVariableNamesRule;
  }
});
Object.defineProperty(exports, 'VariablesAreInputTypesRule', {
  enumerable: true,
  get: function get() {
    return _validation.VariablesAreInputTypesRule;
  }
});
Object.defineProperty(exports, 'VariablesInAllowedPositionRule', {
  enumerable: true,
  get: function get() {
    return _validation.VariablesInAllowedPositionRule;
  }
});

var _error = __webpack_require__(0);

Object.defineProperty(exports, 'GraphQLError', {
  enumerable: true,
  get: function get() {
    return _error.GraphQLError;
  }
});
Object.defineProperty(exports, 'formatError', {
  enumerable: true,
  get: function get() {
    return _error.formatError;
  }
});

var _utilities = __webpack_require__(211);

Object.defineProperty(exports, 'introspectionQuery', {
  enumerable: true,
  get: function get() {
    return _utilities.introspectionQuery;
  }
});
Object.defineProperty(exports, 'getOperationAST', {
  enumerable: true,
  get: function get() {
    return _utilities.getOperationAST;
  }
});
Object.defineProperty(exports, 'buildClientSchema', {
  enumerable: true,
  get: function get() {
    return _utilities.buildClientSchema;
  }
});
Object.defineProperty(exports, 'buildASTSchema', {
  enumerable: true,
  get: function get() {
    return _utilities.buildASTSchema;
  }
});
Object.defineProperty(exports, 'buildSchema', {
  enumerable: true,
  get: function get() {
    return _utilities.buildSchema;
  }
});
Object.defineProperty(exports, 'extendSchema', {
  enumerable: true,
  get: function get() {
    return _utilities.extendSchema;
  }
});
Object.defineProperty(exports, 'printSchema', {
  enumerable: true,
  get: function get() {
    return _utilities.printSchema;
  }
});
Object.defineProperty(exports, 'printIntrospectionSchema', {
  enumerable: true,
  get: function get() {
    return _utilities.printIntrospectionSchema;
  }
});
Object.defineProperty(exports, 'printType', {
  enumerable: true,
  get: function get() {
    return _utilities.printType;
  }
});
Object.defineProperty(exports, 'typeFromAST', {
  enumerable: true,
  get: function get() {
    return _utilities.typeFromAST;
  }
});
Object.defineProperty(exports, 'valueFromAST', {
  enumerable: true,
  get: function get() {
    return _utilities.valueFromAST;
  }
});
Object.defineProperty(exports, 'astFromValue', {
  enumerable: true,
  get: function get() {
    return _utilities.astFromValue;
  }
});
Object.defineProperty(exports, 'TypeInfo', {
  enumerable: true,
  get: function get() {
    return _utilities.TypeInfo;
  }
});
Object.defineProperty(exports, 'isValidJSValue', {
  enumerable: true,
  get: function get() {
    return _utilities.isValidJSValue;
  }
});
Object.defineProperty(exports, 'isValidLiteralValue', {
  enumerable: true,
  get: function get() {
    return _utilities.isValidLiteralValue;
  }
});
Object.defineProperty(exports, 'concatAST', {
  enumerable: true,
  get: function get() {
    return _utilities.concatAST;
  }
});
Object.defineProperty(exports, 'separateOperations', {
  enumerable: true,
  get: function get() {
    return _utilities.separateOperations;
  }
});
Object.defineProperty(exports, 'isEqualType', {
  enumerable: true,
  get: function get() {
    return _utilities.isEqualType;
  }
});
Object.defineProperty(exports, 'isTypeSubTypeOf', {
  enumerable: true,
  get: function get() {
    return _utilities.isTypeSubTypeOf;
  }
});
Object.defineProperty(exports, 'doTypesOverlap', {
  enumerable: true,
  get: function get() {
    return _utilities.doTypesOverlap;
  }
});
Object.defineProperty(exports, 'assertValidName', {
  enumerable: true,
  get: function get() {
    return _utilities.assertValidName;
  }
});
Object.defineProperty(exports, 'findBreakingChanges', {
  enumerable: true,
  get: function get() {
    return _utilities.findBreakingChanges;
  }
});
Object.defineProperty(exports, 'BreakingChangeType', {
  enumerable: true,
  get: function get() {
    return _utilities.BreakingChangeType;
  }
});
Object.defineProperty(exports, 'DangerousChangeType', {
  enumerable: true,
  get: function get() {
    return _utilities.DangerousChangeType;
  }
});
Object.defineProperty(exports, 'findDeprecatedUsages', {
  enumerable: true,
  get: function get() {
    return _utilities.findDeprecatedUsages;
  }
});

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphql = graphql;

var _parser = __webpack_require__(34);

var _validate = __webpack_require__(79);

var _execute = __webpack_require__(55);

/**
 * This is the primary entry point function for fulfilling GraphQL operations
 * by parsing, validating, and executing a GraphQL document along side a
 * GraphQL schema.
 *
 * More sophisticated GraphQL servers, such as those which persist queries,
 * may wish to separate the validation and execution phases to a static time
 * tooling step, and a server runtime step.
 *
 * Accepts either an object with named arguments, or individual arguments:
 *
 * schema:
 *    The GraphQL type system to use when validating and executing a query.
 * source:
 *    A GraphQL language formatted string representing the requested operation.
 * rootValue:
 *    The value provided as the first argument to resolver functions on the top
 *    level type (e.g. the query object type).
 * variableValues:
 *    A mapping of variable name to runtime value to use for all variables
 *    defined in the requestString.
 * operationName:
 *    The name of the operation to use if requestString contains multiple
 *    possible operations. Can be omitted if requestString contains only
 *    one operation.
 * fieldResolver:
 *    A resolver function to use when one is not provided by the schema.
 *    If not provided, the default field resolver is used (which looks for a
 *    value or method on the source value with the field's name).
 */

/* eslint-disable no-redeclare */
function graphql(argsOrSchema, source, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  // Extract arguments from object args if provided.
  var args = arguments.length === 1 ? argsOrSchema : undefined;
  var schema = args ? args.schema : argsOrSchema;
  return args ? graphqlImpl(schema, args.source, args.rootValue, args.contextValue, args.variableValues, args.operationName, args.fieldResolver) : graphqlImpl(schema, source, rootValue, contextValue, variableValues, operationName, fieldResolver);
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function graphqlImpl(schema, source, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  return new Promise(function (resolve) {
    // Parse
    var document = void 0;
    try {
      document = (0, _parser.parse)(source);
    } catch (syntaxError) {
      return resolve({ errors: [syntaxError] });
    }

    // Validate
    var validationErrors = (0, _validate.validate)(schema, document);
    if (validationErrors.length > 0) {
      return resolve({ errors: validationErrors });
    }

    // Execute
    resolve((0, _execute.execute)(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver));
  });
}

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntaxError = syntaxError;

var _location = __webpack_require__(48);

var _GraphQLError = __webpack_require__(25);

/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function syntaxError(source, position, description) {
  var location = (0, _location.getLocation)(source, position);
  var error = new _GraphQLError.GraphQLError('Syntax Error ' + source.name + ' (' + location.line + ':' + location.column + ') ' + description + '\n\n' + highlightSourceAtLocation(source, location), undefined, source, [position]);
  return error;
}

/**
 * Render a helpful description of the location of the error in the GraphQL
 * Source document.
 */
function highlightSourceAtLocation(source, location) {
  var line = location.line;
  var prevLineNum = (line - 1).toString();
  var lineNum = line.toString();
  var nextLineNum = (line + 1).toString();
  var padLen = nextLineNum.length;
  var lines = source.body.split(/\r\n|[\n\r]/g);
  return (line >= 2 ? lpad(padLen, prevLineNum) + ': ' + lines[line - 2] + '\n' : '') + lpad(padLen, lineNum) + ': ' + lines[line - 1] + '\n' + Array(2 + padLen + location.column).join(' ') + '^\n' + (line < lines.length ? lpad(padLen, nextLineNum) + ': ' + lines[line] + '\n' : '');
}

function lpad(len, str) {
  return Array(len - str.length + 1).join(' ') + str;
}

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locatedError = locatedError;

var _GraphQLError = __webpack_require__(25);

/**
 * Given an arbitrary Error, presumably thrown while attempting to execute a
 * GraphQL operation, produce a new GraphQLError aware of the location in the
 * document responsible for the original Error.
 */
function locatedError(originalError, nodes, path) {
  // Note: this uses a brand-check to support GraphQL errors originating from
  // other contexts.
  if (originalError && originalError.path) {
    return originalError;
  }

  var message = originalError ? originalError.message || String(originalError) : 'An unknown error occurred.';
  return new _GraphQLError.GraphQLError(message, originalError && originalError.nodes || nodes, originalError && originalError.source, originalError && originalError.positions, path, originalError);
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatError = formatError;

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification.
 */
function formatError(error) {
  (0, _invariant2.default)(error, 'Received null or undefined error.');
  return {
    message: error.message,
    locations: error.locations,
    path: error.path
  };
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = __webpack_require__(9);

Object.defineProperty(exports, 'GraphQLSchema', {
  enumerable: true,
  get: function get() {
    return _schema.GraphQLSchema;
  }
});

var _definition = __webpack_require__(1);

Object.defineProperty(exports, 'isType', {
  enumerable: true,
  get: function get() {
    return _definition.isType;
  }
});
Object.defineProperty(exports, 'isInputType', {
  enumerable: true,
  get: function get() {
    return _definition.isInputType;
  }
});
Object.defineProperty(exports, 'isOutputType', {
  enumerable: true,
  get: function get() {
    return _definition.isOutputType;
  }
});
Object.defineProperty(exports, 'isLeafType', {
  enumerable: true,
  get: function get() {
    return _definition.isLeafType;
  }
});
Object.defineProperty(exports, 'isCompositeType', {
  enumerable: true,
  get: function get() {
    return _definition.isCompositeType;
  }
});
Object.defineProperty(exports, 'isAbstractType', {
  enumerable: true,
  get: function get() {
    return _definition.isAbstractType;
  }
});
Object.defineProperty(exports, 'isNamedType', {
  enumerable: true,
  get: function get() {
    return _definition.isNamedType;
  }
});
Object.defineProperty(exports, 'assertType', {
  enumerable: true,
  get: function get() {
    return _definition.assertType;
  }
});
Object.defineProperty(exports, 'assertInputType', {
  enumerable: true,
  get: function get() {
    return _definition.assertInputType;
  }
});
Object.defineProperty(exports, 'assertOutputType', {
  enumerable: true,
  get: function get() {
    return _definition.assertOutputType;
  }
});
Object.defineProperty(exports, 'assertLeafType', {
  enumerable: true,
  get: function get() {
    return _definition.assertLeafType;
  }
});
Object.defineProperty(exports, 'assertCompositeType', {
  enumerable: true,
  get: function get() {
    return _definition.assertCompositeType;
  }
});
Object.defineProperty(exports, 'assertAbstractType', {
  enumerable: true,
  get: function get() {
    return _definition.assertAbstractType;
  }
});
Object.defineProperty(exports, 'assertNamedType', {
  enumerable: true,
  get: function get() {
    return _definition.assertNamedType;
  }
});
Object.defineProperty(exports, 'getNullableType', {
  enumerable: true,
  get: function get() {
    return _definition.getNullableType;
  }
});
Object.defineProperty(exports, 'getNamedType', {
  enumerable: true,
  get: function get() {
    return _definition.getNamedType;
  }
});
Object.defineProperty(exports, 'GraphQLScalarType', {
  enumerable: true,
  get: function get() {
    return _definition.GraphQLScalarType;
  }
});
Object.defineProperty(exports, 'GraphQLObjectType', {
  enumerable: true,
  get: function get() {
    return _definition.GraphQLObjectType;
  }
});
Object.defineProperty(exports, 'GraphQLInterfaceType', {
  enumerable: true,
  get: function get() {
    return _definition.GraphQLInterfaceType;
  }
});
Object.defineProperty(exports, 'GraphQLUnionType', {
  enumerable: true,
  get: function get() {
    return _definition.GraphQLUnionType;
  }
});
Object.defineProperty(exports, 'GraphQLEnumType', {
  enumerable: true,
  get: function get() {
    return _definition.GraphQLEnumType;
  }
});
Object.defineProperty(exports, 'GraphQLInputObjectType', {
  enumerable: true,
  get: function get() {
    return _definition.GraphQLInputObjectType;
  }
});
Object.defineProperty(exports, 'GraphQLList', {
  enumerable: true,
  get: function get() {
    return _definition.GraphQLList;
  }
});
Object.defineProperty(exports, 'GraphQLNonNull', {
  enumerable: true,
  get: function get() {
    return _definition.GraphQLNonNull;
  }
});

var _directives = __webpack_require__(10);

Object.defineProperty(exports, 'DirectiveLocation', {
  enumerable: true,
  get: function get() {
    return _directives.DirectiveLocation;
  }
});
Object.defineProperty(exports, 'GraphQLDirective', {
  enumerable: true,
  get: function get() {
    return _directives.GraphQLDirective;
  }
});
Object.defineProperty(exports, 'specifiedDirectives', {
  enumerable: true,
  get: function get() {
    return _directives.specifiedDirectives;
  }
});
Object.defineProperty(exports, 'GraphQLIncludeDirective', {
  enumerable: true,
  get: function get() {
    return _directives.GraphQLIncludeDirective;
  }
});
Object.defineProperty(exports, 'GraphQLSkipDirective', {
  enumerable: true,
  get: function get() {
    return _directives.GraphQLSkipDirective;
  }
});
Object.defineProperty(exports, 'GraphQLDeprecatedDirective', {
  enumerable: true,
  get: function get() {
    return _directives.GraphQLDeprecatedDirective;
  }
});
Object.defineProperty(exports, 'DEFAULT_DEPRECATION_REASON', {
  enumerable: true,
  get: function get() {
    return _directives.DEFAULT_DEPRECATION_REASON;
  }
});

var _scalars = __webpack_require__(12);

Object.defineProperty(exports, 'GraphQLInt', {
  enumerable: true,
  get: function get() {
    return _scalars.GraphQLInt;
  }
});
Object.defineProperty(exports, 'GraphQLFloat', {
  enumerable: true,
  get: function get() {
    return _scalars.GraphQLFloat;
  }
});
Object.defineProperty(exports, 'GraphQLString', {
  enumerable: true,
  get: function get() {
    return _scalars.GraphQLString;
  }
});
Object.defineProperty(exports, 'GraphQLBoolean', {
  enumerable: true,
  get: function get() {
    return _scalars.GraphQLBoolean;
  }
});
Object.defineProperty(exports, 'GraphQLID', {
  enumerable: true,
  get: function get() {
    return _scalars.GraphQLID;
  }
});

var _introspection = __webpack_require__(15);

Object.defineProperty(exports, 'TypeKind', {
  enumerable: true,
  get: function get() {
    return _introspection.TypeKind;
  }
});
Object.defineProperty(exports, '__Schema', {
  enumerable: true,
  get: function get() {
    return _introspection.__Schema;
  }
});
Object.defineProperty(exports, '__Directive', {
  enumerable: true,
  get: function get() {
    return _introspection.__Directive;
  }
});
Object.defineProperty(exports, '__DirectiveLocation', {
  enumerable: true,
  get: function get() {
    return _introspection.__DirectiveLocation;
  }
});
Object.defineProperty(exports, '__Type', {
  enumerable: true,
  get: function get() {
    return _introspection.__Type;
  }
});
Object.defineProperty(exports, '__Field', {
  enumerable: true,
  get: function get() {
    return _introspection.__Field;
  }
});
Object.defineProperty(exports, '__InputValue', {
  enumerable: true,
  get: function get() {
    return _introspection.__InputValue;
  }
});
Object.defineProperty(exports, '__EnumValue', {
  enumerable: true,
  get: function get() {
    return _introspection.__EnumValue;
  }
});
Object.defineProperty(exports, '__TypeKind', {
  enumerable: true,
  get: function get() {
    return _introspection.__TypeKind;
  }
});
Object.defineProperty(exports, 'SchemaMetaFieldDef', {
  enumerable: true,
  get: function get() {
    return _introspection.SchemaMetaFieldDef;
  }
});
Object.defineProperty(exports, 'TypeMetaFieldDef', {
  enumerable: true,
  get: function get() {
    return _introspection.TypeMetaFieldDef;
  }
});
Object.defineProperty(exports, 'TypeNameMetaFieldDef', {
  enumerable: true,
  get: function get() {
    return _introspection.TypeNameMetaFieldDef;
  }
});

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BREAK = exports.getVisitFn = exports.visitWithTypeInfo = exports.visitInParallel = exports.visit = exports.Source = exports.print = exports.parseType = exports.parseValue = exports.parse = exports.TokenKind = exports.createLexer = exports.Kind = exports.getLocation = undefined;

var _location = __webpack_require__(48);

Object.defineProperty(exports, 'getLocation', {
  enumerable: true,
  get: function get() {
    return _location.getLocation;
  }
});

var _lexer = __webpack_require__(49);

Object.defineProperty(exports, 'createLexer', {
  enumerable: true,
  get: function get() {
    return _lexer.createLexer;
  }
});
Object.defineProperty(exports, 'TokenKind', {
  enumerable: true,
  get: function get() {
    return _lexer.TokenKind;
  }
});

var _parser = __webpack_require__(34);

Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _parser.parse;
  }
});
Object.defineProperty(exports, 'parseValue', {
  enumerable: true,
  get: function get() {
    return _parser.parseValue;
  }
});
Object.defineProperty(exports, 'parseType', {
  enumerable: true,
  get: function get() {
    return _parser.parseType;
  }
});

var _printer = __webpack_require__(7);

Object.defineProperty(exports, 'print', {
  enumerable: true,
  get: function get() {
    return _printer.print;
  }
});

var _source = __webpack_require__(78);

Object.defineProperty(exports, 'Source', {
  enumerable: true,
  get: function get() {
    return _source.Source;
  }
});

var _visitor = __webpack_require__(26);

Object.defineProperty(exports, 'visit', {
  enumerable: true,
  get: function get() {
    return _visitor.visit;
  }
});
Object.defineProperty(exports, 'visitInParallel', {
  enumerable: true,
  get: function get() {
    return _visitor.visitInParallel;
  }
});
Object.defineProperty(exports, 'visitWithTypeInfo', {
  enumerable: true,
  get: function get() {
    return _visitor.visitWithTypeInfo;
  }
});
Object.defineProperty(exports, 'getVisitFn', {
  enumerable: true,
  get: function get() {
    return _visitor.getVisitFn;
  }
});
Object.defineProperty(exports, 'BREAK', {
  enumerable: true,
  get: function get() {
    return _visitor.BREAK;
  }
});

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.Kind = Kind;

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _execute = __webpack_require__(55);

Object.defineProperty(exports, 'execute', {
  enumerable: true,
  get: function get() {
    return _execute.execute;
  }
});
Object.defineProperty(exports, 'defaultFieldResolver', {
  enumerable: true,
  get: function get() {
    return _execute.defaultFieldResolver;
  }
});
Object.defineProperty(exports, 'responsePathAsArray', {
  enumerable: true,
  get: function get() {
    return _execute.responsePathAsArray;
  }
});

var _values = __webpack_require__(56);

Object.defineProperty(exports, 'getDirectiveValues', {
  enumerable: true,
  get: function get() {
    return _values.getDirectiveValues;
  }
});

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _subscribe = __webpack_require__(208);

Object.defineProperty(exports, 'subscribe', {
  enumerable: true,
  get: function get() {
    return _subscribe.subscribe;
  }
});
Object.defineProperty(exports, 'createSourceEventStream', {
  enumerable: true,
  get: function get() {
    return _subscribe.createSourceEventStream;
  }
});

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribe = subscribe;
exports.createSourceEventStream = createSourceEventStream;

var _iterall = __webpack_require__(19);

var _execute = __webpack_require__(55);

var _schema = __webpack_require__(9);

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _mapAsyncIterator = __webpack_require__(209);

var _mapAsyncIterator2 = _interopRequireDefault(_mapAsyncIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Implements the "Subscribe" algorithm described in the GraphQL specification.
 *
 * Returns an AsyncIterator
 *
 * If the arguments to this function do not result in a legal execution context,
 * a GraphQLError will be thrown immediately explaining the invalid input.
 *
 * Accepts either an object with named arguments, or individual arguments.
 */

/* eslint-disable no-redeclare */
function subscribe(argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver) {
  // Extract arguments from object args if provided.
  var args = arguments.length === 1 ? argsOrSchema : undefined;
  var schema = args ? args.schema : argsOrSchema;
  return args ? subscribeImpl(schema, args.document, args.rootValue, args.contextValue, args.variableValues, args.operationName, args.fieldResolver, args.subscribeFieldResolver) : subscribeImpl(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver);
} /**
   * Copyright (c) 2017, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * 
   */

function subscribeImpl(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver) {
  var subscription = createSourceEventStream(schema, document, rootValue, contextValue, variableValues, operationName, subscribeFieldResolver);

  // For each payload yielded from a subscription, map it over the normal
  // GraphQL `execute` function, with `payload` as the rootValue.
  // This implements the "MapSourceToResponseEvent" algorithm described in
  // the GraphQL specification. The `execute` function provides the
  // "ExecuteSubscriptionEvent" algorithm, as it is nearly identical to the
  // "ExecuteQuery" algorithm, for which `execute` is also used.
  return (0, _mapAsyncIterator2.default)(subscription, function (payload) {
    return (0, _execute.execute)(schema, document, payload, contextValue, variableValues, operationName, fieldResolver);
  });
}

/**
 * Implements the "CreateSourceEventStream" algorithm described in the
 * GraphQL specification, resolving the subscription source event stream.
 *
 * Returns an AsyncIterable, may through a GraphQLError.
 *
 * A Source Stream represents the sequence of events, each of which is
 * expected to be used to trigger a GraphQL execution for that event.
 *
 * This may be useful when hosting the stateful subscription service in a
 * different process or machine than the stateless GraphQL execution engine,
 * or otherwise separating these two steps. For more on this, see the
 * "Supporting Subscriptions at Scale" information in the GraphQL specification.
 */
function createSourceEventStream(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  // If arguments are missing or incorrect, throw an error.
  (0, _execute.assertValidExecutionArguments)(schema, document, variableValues);

  // If a valid context cannot be created due to incorrect arguments,
  // this will throw an error.
  var exeContext = (0, _execute.buildExecutionContext)(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver);

  var type = (0, _execute.getOperationRootType)(schema, exeContext.operation);
  var fields = (0, _execute.collectFields)(exeContext, type, exeContext.operation.selectionSet, Object.create(null), Object.create(null));
  var responseNames = Object.keys(fields);
  var responseName = responseNames[0];
  var fieldNodes = fields[responseName];
  var fieldNode = fieldNodes[0];
  var fieldDef = (0, _execute.getFieldDef)(schema, type, fieldNode.name.value);
  (0, _invariant2.default)(fieldDef, 'This subscription is not defined by the schema.');

  // Call the `subscribe()` resolver or the default resolver to produce an
  // AsyncIterable yielding raw payloads.
  var resolveFn = fieldDef.subscribe || exeContext.fieldResolver;

  var info = (0, _execute.buildResolveInfo)(exeContext, fieldDef, fieldNodes, type, (0, _execute.addPath)(undefined, responseName));

  // resolveFieldValueOrError implements the "ResolveFieldEventStream"
  // algorithm from GraphQL specification. It differs from
  // "ResolveFieldValue" due to providing a different `resolveFn`.
  var subscription = (0, _execute.resolveFieldValueOrError)(exeContext, fieldDef, fieldNodes, resolveFn, rootValue, info);

  if (subscription instanceof Error) {
    throw subscription;
  }

  if (!(0, _iterall.isAsyncIterable)(subscription)) {
    throw new Error('Subscription must return Async Iterable. ' + 'Received: ' + String(subscription));
  }

  return subscription;
}

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mapAsyncIterator;

var _iterall = __webpack_require__(19);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * Copyright (c) 2017, Facebook, Inc.
                                                                                                                                                                                                                   * All rights reserved.
                                                                                                                                                                                                                   *
                                                                                                                                                                                                                   * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                   * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                   * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                   *
                                                                                                                                                                                                                   * 
                                                                                                                                                                                                                   */

/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
function mapAsyncIterator(iterable, callback) {
  var iterator = (0, _iterall.getAsyncIterator)(iterable);
  var $return = void 0;
  var abruptClose = void 0;
  if (typeof iterator.return === 'function') {
    $return = iterator.return;
    abruptClose = function abruptClose(error) {
      var rethrow = function rethrow() {
        return Promise.reject(error);
      };
      return $return.call(iterator).then(rethrow, rethrow);
    };
  }

  function mapResult(result) {
    return result.done ? result : asyncMapValue(result.value, callback).then(iteratorResult, abruptClose);
  }

  return _defineProperty({
    next: function next() {
      return iterator.next().then(mapResult);
    },
    'return': function _return() {
      return $return ? $return.call(iterator).then(mapResult) : Promise.resolve({ value: undefined, done: true });
    },
    'throw': function _throw(error) {
      if (typeof iterator.throw === 'function') {
        return iterator.throw(error).then(mapResult);
      }
      return Promise.reject(error).catch(abruptClose);
    }
  }, _iterall.$$asyncIterator, function () {
    return this;
  });
}

function asyncMapValue(value, callback) {
  return new Promise(function (resolve) {
    return resolve(callback(value));
  });
}

function iteratorResult(value) {
  return { value: value, done: false };
}

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validate = __webpack_require__(79);

Object.defineProperty(exports, 'validate', {
  enumerable: true,
  get: function get() {
    return _validate.validate;
  }
});
Object.defineProperty(exports, 'ValidationContext', {
  enumerable: true,
  get: function get() {
    return _validate.ValidationContext;
  }
});

var _specifiedRules = __webpack_require__(80);

Object.defineProperty(exports, 'specifiedRules', {
  enumerable: true,
  get: function get() {
    return _specifiedRules.specifiedRules;
  }
});

var _ArgumentsOfCorrectType = __webpack_require__(101);

Object.defineProperty(exports, 'ArgumentsOfCorrectTypeRule', {
  enumerable: true,
  get: function get() {
    return _ArgumentsOfCorrectType.ArgumentsOfCorrectType;
  }
});

var _DefaultValuesOfCorrectType = __webpack_require__(103);

Object.defineProperty(exports, 'DefaultValuesOfCorrectTypeRule', {
  enumerable: true,
  get: function get() {
    return _DefaultValuesOfCorrectType.DefaultValuesOfCorrectType;
  }
});

var _FieldsOnCorrectType = __webpack_require__(88);

Object.defineProperty(exports, 'FieldsOnCorrectTypeRule', {
  enumerable: true,
  get: function get() {
    return _FieldsOnCorrectType.FieldsOnCorrectType;
  }
});

var _FragmentsOnCompositeTypes = __webpack_require__(85);

Object.defineProperty(exports, 'FragmentsOnCompositeTypesRule', {
  enumerable: true,
  get: function get() {
    return _FragmentsOnCompositeTypes.FragmentsOnCompositeTypes;
  }
});

var _KnownArgumentNames = __webpack_require__(99);

Object.defineProperty(exports, 'KnownArgumentNamesRule', {
  enumerable: true,
  get: function get() {
    return _KnownArgumentNames.KnownArgumentNames;
  }
});

var _KnownDirectives = __webpack_require__(97);

Object.defineProperty(exports, 'KnownDirectivesRule', {
  enumerable: true,
  get: function get() {
    return _KnownDirectives.KnownDirectives;
  }
});

var _KnownFragmentNames = __webpack_require__(90);

Object.defineProperty(exports, 'KnownFragmentNamesRule', {
  enumerable: true,
  get: function get() {
    return _KnownFragmentNames.KnownFragmentNames;
  }
});

var _KnownTypeNames = __webpack_require__(84);

Object.defineProperty(exports, 'KnownTypeNamesRule', {
  enumerable: true,
  get: function get() {
    return _KnownTypeNames.KnownTypeNames;
  }
});

var _LoneAnonymousOperation = __webpack_require__(82);

Object.defineProperty(exports, 'LoneAnonymousOperationRule', {
  enumerable: true,
  get: function get() {
    return _LoneAnonymousOperation.LoneAnonymousOperation;
  }
});

var _NoFragmentCycles = __webpack_require__(93);

Object.defineProperty(exports, 'NoFragmentCyclesRule', {
  enumerable: true,
  get: function get() {
    return _NoFragmentCycles.NoFragmentCycles;
  }
});

var _NoUndefinedVariables = __webpack_require__(95);

Object.defineProperty(exports, 'NoUndefinedVariablesRule', {
  enumerable: true,
  get: function get() {
    return _NoUndefinedVariables.NoUndefinedVariables;
  }
});

var _NoUnusedFragments = __webpack_require__(91);

Object.defineProperty(exports, 'NoUnusedFragmentsRule', {
  enumerable: true,
  get: function get() {
    return _NoUnusedFragments.NoUnusedFragments;
  }
});

var _NoUnusedVariables = __webpack_require__(96);

Object.defineProperty(exports, 'NoUnusedVariablesRule', {
  enumerable: true,
  get: function get() {
    return _NoUnusedVariables.NoUnusedVariables;
  }
});

var _OverlappingFieldsCanBeMerged = __webpack_require__(105);

Object.defineProperty(exports, 'OverlappingFieldsCanBeMergedRule', {
  enumerable: true,
  get: function get() {
    return _OverlappingFieldsCanBeMerged.OverlappingFieldsCanBeMerged;
  }
});

var _PossibleFragmentSpreads = __webpack_require__(92);

Object.defineProperty(exports, 'PossibleFragmentSpreadsRule', {
  enumerable: true,
  get: function get() {
    return _PossibleFragmentSpreads.PossibleFragmentSpreads;
  }
});

var _ProvidedNonNullArguments = __webpack_require__(102);

Object.defineProperty(exports, 'ProvidedNonNullArgumentsRule', {
  enumerable: true,
  get: function get() {
    return _ProvidedNonNullArguments.ProvidedNonNullArguments;
  }
});

var _ScalarLeafs = __webpack_require__(87);

Object.defineProperty(exports, 'ScalarLeafsRule', {
  enumerable: true,
  get: function get() {
    return _ScalarLeafs.ScalarLeafs;
  }
});

var _SingleFieldSubscriptions = __webpack_require__(83);

Object.defineProperty(exports, 'SingleFieldSubscriptionsRule', {
  enumerable: true,
  get: function get() {
    return _SingleFieldSubscriptions.SingleFieldSubscriptions;
  }
});

var _UniqueArgumentNames = __webpack_require__(100);

Object.defineProperty(exports, 'UniqueArgumentNamesRule', {
  enumerable: true,
  get: function get() {
    return _UniqueArgumentNames.UniqueArgumentNames;
  }
});

var _UniqueDirectivesPerLocation = __webpack_require__(98);

Object.defineProperty(exports, 'UniqueDirectivesPerLocationRule', {
  enumerable: true,
  get: function get() {
    return _UniqueDirectivesPerLocation.UniqueDirectivesPerLocation;
  }
});

var _UniqueFragmentNames = __webpack_require__(89);

Object.defineProperty(exports, 'UniqueFragmentNamesRule', {
  enumerable: true,
  get: function get() {
    return _UniqueFragmentNames.UniqueFragmentNames;
  }
});

var _UniqueInputFieldNames = __webpack_require__(106);

Object.defineProperty(exports, 'UniqueInputFieldNamesRule', {
  enumerable: true,
  get: function get() {
    return _UniqueInputFieldNames.UniqueInputFieldNames;
  }
});

var _UniqueOperationNames = __webpack_require__(81);

Object.defineProperty(exports, 'UniqueOperationNamesRule', {
  enumerable: true,
  get: function get() {
    return _UniqueOperationNames.UniqueOperationNames;
  }
});

var _UniqueVariableNames = __webpack_require__(94);

Object.defineProperty(exports, 'UniqueVariableNamesRule', {
  enumerable: true,
  get: function get() {
    return _UniqueVariableNames.UniqueVariableNames;
  }
});

var _VariablesAreInputTypes = __webpack_require__(86);

Object.defineProperty(exports, 'VariablesAreInputTypesRule', {
  enumerable: true,
  get: function get() {
    return _VariablesAreInputTypes.VariablesAreInputTypes;
  }
});

var _VariablesInAllowedPosition = __webpack_require__(104);

Object.defineProperty(exports, 'VariablesInAllowedPositionRule', {
  enumerable: true,
  get: function get() {
    return _VariablesInAllowedPosition.VariablesInAllowedPosition;
  }
});

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _introspectionQuery = __webpack_require__(212);

Object.defineProperty(exports, 'introspectionQuery', {
  enumerable: true,
  get: function get() {
    return _introspectionQuery.introspectionQuery;
  }
});

var _getOperationAST = __webpack_require__(213);

Object.defineProperty(exports, 'getOperationAST', {
  enumerable: true,
  get: function get() {
    return _getOperationAST.getOperationAST;
  }
});

var _buildClientSchema = __webpack_require__(214);

Object.defineProperty(exports, 'buildClientSchema', {
  enumerable: true,
  get: function get() {
    return _buildClientSchema.buildClientSchema;
  }
});

var _buildASTSchema = __webpack_require__(108);

Object.defineProperty(exports, 'buildASTSchema', {
  enumerable: true,
  get: function get() {
    return _buildASTSchema.buildASTSchema;
  }
});
Object.defineProperty(exports, 'buildSchema', {
  enumerable: true,
  get: function get() {
    return _buildASTSchema.buildSchema;
  }
});

var _extendSchema = __webpack_require__(215);

Object.defineProperty(exports, 'extendSchema', {
  enumerable: true,
  get: function get() {
    return _extendSchema.extendSchema;
  }
});

var _schemaPrinter = __webpack_require__(216);

Object.defineProperty(exports, 'printSchema', {
  enumerable: true,
  get: function get() {
    return _schemaPrinter.printSchema;
  }
});
Object.defineProperty(exports, 'printType', {
  enumerable: true,
  get: function get() {
    return _schemaPrinter.printType;
  }
});
Object.defineProperty(exports, 'printIntrospectionSchema', {
  enumerable: true,
  get: function get() {
    return _schemaPrinter.printIntrospectionSchema;
  }
});

var _typeFromAST = __webpack_require__(11);

Object.defineProperty(exports, 'typeFromAST', {
  enumerable: true,
  get: function get() {
    return _typeFromAST.typeFromAST;
  }
});

var _valueFromAST = __webpack_require__(28);

Object.defineProperty(exports, 'valueFromAST', {
  enumerable: true,
  get: function get() {
    return _valueFromAST.valueFromAST;
  }
});

var _astFromValue = __webpack_require__(51);

Object.defineProperty(exports, 'astFromValue', {
  enumerable: true,
  get: function get() {
    return _astFromValue.astFromValue;
  }
});

var _TypeInfo = __webpack_require__(52);

Object.defineProperty(exports, 'TypeInfo', {
  enumerable: true,
  get: function get() {
    return _TypeInfo.TypeInfo;
  }
});

var _isValidJSValue = __webpack_require__(107);

Object.defineProperty(exports, 'isValidJSValue', {
  enumerable: true,
  get: function get() {
    return _isValidJSValue.isValidJSValue;
  }
});

var _isValidLiteralValue = __webpack_require__(36);

Object.defineProperty(exports, 'isValidLiteralValue', {
  enumerable: true,
  get: function get() {
    return _isValidLiteralValue.isValidLiteralValue;
  }
});

var _concatAST = __webpack_require__(217);

Object.defineProperty(exports, 'concatAST', {
  enumerable: true,
  get: function get() {
    return _concatAST.concatAST;
  }
});

var _separateOperations = __webpack_require__(218);

Object.defineProperty(exports, 'separateOperations', {
  enumerable: true,
  get: function get() {
    return _separateOperations.separateOperations;
  }
});

var _typeComparators = __webpack_require__(35);

Object.defineProperty(exports, 'isEqualType', {
  enumerable: true,
  get: function get() {
    return _typeComparators.isEqualType;
  }
});
Object.defineProperty(exports, 'isTypeSubTypeOf', {
  enumerable: true,
  get: function get() {
    return _typeComparators.isTypeSubTypeOf;
  }
});
Object.defineProperty(exports, 'doTypesOverlap', {
  enumerable: true,
  get: function get() {
    return _typeComparators.doTypesOverlap;
  }
});

var _assertValidName = __webpack_require__(50);

Object.defineProperty(exports, 'assertValidName', {
  enumerable: true,
  get: function get() {
    return _assertValidName.assertValidName;
  }
});

var _findBreakingChanges = __webpack_require__(219);

Object.defineProperty(exports, 'BreakingChangeType', {
  enumerable: true,
  get: function get() {
    return _findBreakingChanges.BreakingChangeType;
  }
});
Object.defineProperty(exports, 'DangerousChangeType', {
  enumerable: true,
  get: function get() {
    return _findBreakingChanges.DangerousChangeType;
  }
});
Object.defineProperty(exports, 'findBreakingChanges', {
  enumerable: true,
  get: function get() {
    return _findBreakingChanges.findBreakingChanges;
  }
});

var _findDeprecatedUsages = __webpack_require__(220);

Object.defineProperty(exports, 'findDeprecatedUsages', {
  enumerable: true,
  get: function get() {
    return _findDeprecatedUsages.findDeprecatedUsages;
  }
});

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var introspectionQuery = exports.introspectionQuery = '\n  query IntrospectionQuery {\n    __schema {\n      queryType { name }\n      mutationType { name }\n      subscriptionType { name }\n      types {\n        ...FullType\n      }\n      directives {\n        name\n        description\n        locations\n        args {\n          ...InputValue\n        }\n      }\n    }\n  }\n\n  fragment FullType on __Type {\n    kind\n    name\n    description\n    fields(includeDeprecated: true) {\n      name\n      description\n      args {\n        ...InputValue\n      }\n      type {\n        ...TypeRef\n      }\n      isDeprecated\n      deprecationReason\n    }\n    inputFields {\n      ...InputValue\n    }\n    interfaces {\n      ...TypeRef\n    }\n    enumValues(includeDeprecated: true) {\n      name\n      description\n      isDeprecated\n      deprecationReason\n    }\n    possibleTypes {\n      ...TypeRef\n    }\n  }\n\n  fragment InputValue on __InputValue {\n    name\n    description\n    type { ...TypeRef }\n    defaultValue\n  }\n\n  fragment TypeRef on __Type {\n    kind\n    name\n    ofType {\n      kind\n      name\n      ofType {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n              ofType {\n                kind\n                name\n                ofType {\n                  kind\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n';
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOperationAST = getOperationAST;

var _kinds = __webpack_require__(2);

/**
 * Returns an operation AST given a document AST and optionally an operation
 * name. If a name is not provided, an operation is only returned if only one is
 * provided in the document.
 */
function getOperationAST(documentAST, operationName) {
  var operation = null;
  for (var i = 0; i < documentAST.definitions.length; i++) {
    var definition = documentAST.definitions[i];
    if (definition.kind === _kinds.OPERATION_DEFINITION) {
      if (!operationName) {
        // If no operation name was provided, only return an Operation if there
        // is one defined in the document. Upon encountering the second, return
        // null.
        if (operation) {
          return null;
        }
        operation = definition;
      } else if (definition.name && definition.name.value === operationName) {
        return definition;
      }
    }
  }
  return operation;
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildClientSchema = buildClientSchema;

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _keyMap = __webpack_require__(21);

var _keyMap2 = _interopRequireDefault(_keyMap);

var _keyValMap = __webpack_require__(57);

var _keyValMap2 = _interopRequireDefault(_keyValMap);

var _valueFromAST = __webpack_require__(28);

var _parser = __webpack_require__(34);

var _schema = __webpack_require__(9);

var _definition = __webpack_require__(1);

var _introspection = __webpack_require__(15);

var _scalars = __webpack_require__(12);

var _directives = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Build a GraphQLSchema for use by client tools.
 *
 * Given the result of a client running the introspection query, creates and
 * returns a GraphQLSchema instance which can be then used with all graphql-js
 * tools, but cannot be used to execute a query, as introspection does not
 * represent the "resolver", "parse" or "serialize" functions or any other
 * server-internal mechanisms.
 */
function buildClientSchema(introspection) {

  // Get the schema from the introspection result.
  var schemaIntrospection = introspection.__schema;

  // Converts the list of types into a keyMap based on the type names.
  var typeIntrospectionMap = (0, _keyMap2.default)(schemaIntrospection.types, function (type) {
    return type.name;
  });

  // A cache to use to store the actual GraphQLType definition objects by name.
  // Initialize to the GraphQL built in scalars. All functions below are inline
  // so that this type def cache is within the scope of the closure.
  var typeDefCache = {
    String: _scalars.GraphQLString,
    Int: _scalars.GraphQLInt,
    Float: _scalars.GraphQLFloat,
    Boolean: _scalars.GraphQLBoolean,
    ID: _scalars.GraphQLID,
    __Schema: _introspection.__Schema,
    __Directive: _introspection.__Directive,
    __DirectiveLocation: _introspection.__DirectiveLocation,
    __Type: _introspection.__Type,
    __Field: _introspection.__Field,
    __InputValue: _introspection.__InputValue,
    __EnumValue: _introspection.__EnumValue,
    __TypeKind: _introspection.__TypeKind
  };

  // Given a type reference in introspection, return the GraphQLType instance.
  // preferring cached instances before building new instances.
  function getType(typeRef) {
    if (typeRef.kind === _introspection.TypeKind.LIST) {
      var itemRef = typeRef.ofType;
      if (!itemRef) {
        throw new Error('Decorated type deeper than introspection query.');
      }
      return new _definition.GraphQLList(getType(itemRef));
    }
    if (typeRef.kind === _introspection.TypeKind.NON_NULL) {
      var nullableRef = typeRef.ofType;
      if (!nullableRef) {
        throw new Error('Decorated type deeper than introspection query.');
      }
      var nullableType = getType(nullableRef);
      (0, _invariant2.default)(!(nullableType instanceof _definition.GraphQLNonNull), 'No nesting nonnull.');
      return new _definition.GraphQLNonNull(nullableType);
    }
    return getNamedType(typeRef.name);
  }

  function getNamedType(typeName) {
    if (typeDefCache[typeName]) {
      return typeDefCache[typeName];
    }
    var typeIntrospection = typeIntrospectionMap[typeName];
    if (!typeIntrospection) {
      throw new Error('Invalid or incomplete schema, unknown type: ' + typeName + '. Ensure ' + 'that a full introspection query is used in order to build a ' + 'client schema.');
    }
    var typeDef = buildType(typeIntrospection);
    typeDefCache[typeName] = typeDef;
    return typeDef;
  }

  function getInputType(typeRef) {
    var type = getType(typeRef);
    (0, _invariant2.default)((0, _definition.isInputType)(type), 'Introspection must provide input type for arguments.');
    return type;
  }

  function getOutputType(typeRef) {
    var type = getType(typeRef);
    (0, _invariant2.default)((0, _definition.isOutputType)(type), 'Introspection must provide output type for fields.');
    return type;
  }

  function getObjectType(typeRef) {
    var type = getType(typeRef);
    (0, _invariant2.default)(type instanceof _definition.GraphQLObjectType, 'Introspection must provide object type for possibleTypes.');
    return type;
  }

  function getInterfaceType(typeRef) {
    var type = getType(typeRef);
    (0, _invariant2.default)(type instanceof _definition.GraphQLInterfaceType, 'Introspection must provide interface type for interfaces.');
    return type;
  }

  // Given a type's introspection result, construct the correct
  // GraphQLType instance.
  function buildType(type) {
    switch (type.kind) {
      case _introspection.TypeKind.SCALAR:
        return buildScalarDef(type);
      case _introspection.TypeKind.OBJECT:
        return buildObjectDef(type);
      case _introspection.TypeKind.INTERFACE:
        return buildInterfaceDef(type);
      case _introspection.TypeKind.UNION:
        return buildUnionDef(type);
      case _introspection.TypeKind.ENUM:
        return buildEnumDef(type);
      case _introspection.TypeKind.INPUT_OBJECT:
        return buildInputObjectDef(type);
      default:
        throw new Error('Invalid or incomplete schema, unknown kind: ' + type.kind + '. Ensure ' + 'that a full introspection query is used in order to build a ' + 'client schema.');
    }
  }

  function buildScalarDef(scalarIntrospection) {
    return new _definition.GraphQLScalarType({
      name: scalarIntrospection.name,
      description: scalarIntrospection.description,
      serialize: function serialize(id) {
        return id;
      },
      // Note: validation calls the parse functions to determine if a
      // literal value is correct. Returning null would cause use of custom
      // scalars to always fail validation. Returning false causes them to
      // always pass validation.
      parseValue: function parseValue() {
        return false;
      },
      parseLiteral: function parseLiteral() {
        return false;
      }
    });
  }

  function buildObjectDef(objectIntrospection) {
    return new _definition.GraphQLObjectType({
      name: objectIntrospection.name,
      description: objectIntrospection.description,
      interfaces: objectIntrospection.interfaces.map(getInterfaceType),
      fields: function fields() {
        return buildFieldDefMap(objectIntrospection);
      }
    });
  }

  function buildInterfaceDef(interfaceIntrospection) {
    return new _definition.GraphQLInterfaceType({
      name: interfaceIntrospection.name,
      description: interfaceIntrospection.description,
      fields: function fields() {
        return buildFieldDefMap(interfaceIntrospection);
      },
      resolveType: cannotExecuteClientSchema
    });
  }

  function buildUnionDef(unionIntrospection) {
    return new _definition.GraphQLUnionType({
      name: unionIntrospection.name,
      description: unionIntrospection.description,
      types: unionIntrospection.possibleTypes.map(getObjectType),
      resolveType: cannotExecuteClientSchema
    });
  }

  function buildEnumDef(enumIntrospection) {
    return new _definition.GraphQLEnumType({
      name: enumIntrospection.name,
      description: enumIntrospection.description,
      values: (0, _keyValMap2.default)(enumIntrospection.enumValues, function (valueIntrospection) {
        return valueIntrospection.name;
      }, function (valueIntrospection) {
        return {
          description: valueIntrospection.description,
          deprecationReason: valueIntrospection.deprecationReason
        };
      })
    });
  }

  function buildInputObjectDef(inputObjectIntrospection) {
    return new _definition.GraphQLInputObjectType({
      name: inputObjectIntrospection.name,
      description: inputObjectIntrospection.description,
      fields: function fields() {
        return buildInputValueDefMap(inputObjectIntrospection.inputFields);
      }
    });
  }

  function buildFieldDefMap(typeIntrospection) {
    return (0, _keyValMap2.default)(typeIntrospection.fields, function (fieldIntrospection) {
      return fieldIntrospection.name;
    }, function (fieldIntrospection) {
      return {
        description: fieldIntrospection.description,
        deprecationReason: fieldIntrospection.deprecationReason,
        type: getOutputType(fieldIntrospection.type),
        args: buildInputValueDefMap(fieldIntrospection.args)
      };
    });
  }

  function buildInputValueDefMap(inputValueIntrospections) {
    return (0, _keyValMap2.default)(inputValueIntrospections, function (inputValue) {
      return inputValue.name;
    }, buildInputValue);
  }

  function buildInputValue(inputValueIntrospection) {
    var type = getInputType(inputValueIntrospection.type);
    var defaultValue = inputValueIntrospection.defaultValue ? (0, _valueFromAST.valueFromAST)((0, _parser.parseValue)(inputValueIntrospection.defaultValue), type) : undefined;
    return {
      name: inputValueIntrospection.name,
      description: inputValueIntrospection.description,
      type: type,
      defaultValue: defaultValue
    };
  }

  function buildDirective(directiveIntrospection) {
    // Support deprecated `on****` fields for building `locations`, as this
    // is used by GraphiQL which may need to support outdated servers.
    var locations = directiveIntrospection.locations ? directiveIntrospection.locations.slice() : [].concat(!directiveIntrospection.onField ? [] : [_directives.DirectiveLocation.FIELD], !directiveIntrospection.onOperation ? [] : [_directives.DirectiveLocation.QUERY, _directives.DirectiveLocation.MUTATION, _directives.DirectiveLocation.SUBSCRIPTION], !directiveIntrospection.onFragment ? [] : [_directives.DirectiveLocation.FRAGMENT_DEFINITION, _directives.DirectiveLocation.FRAGMENT_SPREAD, _directives.DirectiveLocation.INLINE_FRAGMENT]);
    return new _directives.GraphQLDirective({
      name: directiveIntrospection.name,
      description: directiveIntrospection.description,
      locations: locations,
      args: buildInputValueDefMap(directiveIntrospection.args)
    });
  }

  // Iterate through all types, getting the type definition for each, ensuring
  // that any type not directly referenced by a field will get created.
  var types = schemaIntrospection.types.map(function (typeIntrospection) {
    return getNamedType(typeIntrospection.name);
  });

  // Get the root Query, Mutation, and Subscription types.
  var queryType = getObjectType(schemaIntrospection.queryType);

  var mutationType = schemaIntrospection.mutationType ? getObjectType(schemaIntrospection.mutationType) : null;

  var subscriptionType = schemaIntrospection.subscriptionType ? getObjectType(schemaIntrospection.subscriptionType) : null;

  // Get the directives supported by Introspection, assuming empty-set if
  // directives were not queried for.
  var directives = schemaIntrospection.directives ? schemaIntrospection.directives.map(buildDirective) : [];

  // Then produce and return a Schema with these types.
  return new _schema.GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    subscription: subscriptionType,
    types: types,
    directives: directives
  });
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function cannotExecuteClientSchema() {
  throw new Error('Client Schema cannot use Interface or Union types for execution.');
}

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendSchema = extendSchema;

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _keyMap = __webpack_require__(21);

var _keyMap2 = _interopRequireDefault(_keyMap);

var _keyValMap = __webpack_require__(57);

var _keyValMap2 = _interopRequireDefault(_keyValMap);

var _buildASTSchema = __webpack_require__(108);

var _valueFromAST = __webpack_require__(28);

var _GraphQLError = __webpack_require__(25);

var _schema = __webpack_require__(9);

var _definition = __webpack_require__(1);

var _directives = __webpack_require__(10);

var _introspection = __webpack_require__(15);

var _scalars = __webpack_require__(12);

var _kinds = __webpack_require__(2);

var Kind = _interopRequireWildcard(_kinds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Produces a new schema given an existing schema and a document which may
 * contain GraphQL type extensions and definitions. The original schema will
 * remain unaltered.
 *
 * Because a schema represents a graph of references, a schema cannot be
 * extended without effectively making an entire copy. We do not know until it's
 * too late if subgraphs remain unchanged.
 *
 * This algorithm copies the provided schema, applying extensions while
 * producing the copy. The original schema remains unaltered.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function extendSchema(schema, documentAST) {
  (0, _invariant2.default)(schema instanceof _schema.GraphQLSchema, 'Must provide valid GraphQLSchema');

  (0, _invariant2.default)(documentAST && documentAST.kind === Kind.DOCUMENT, 'Must provide valid Document AST');

  // Collect the type definitions and extensions found in the document.
  var typeDefinitionMap = Object.create(null);
  var typeExtensionsMap = Object.create(null);

  // New directives and types are separate because a directives and types can
  // have the same name. For example, a type named "skip".
  var directiveDefinitions = [];

  for (var i = 0; i < documentAST.definitions.length; i++) {
    var def = documentAST.definitions[i];
    switch (def.kind) {
      case Kind.OBJECT_TYPE_DEFINITION:
      case Kind.INTERFACE_TYPE_DEFINITION:
      case Kind.ENUM_TYPE_DEFINITION:
      case Kind.UNION_TYPE_DEFINITION:
      case Kind.SCALAR_TYPE_DEFINITION:
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        // Sanity check that none of the defined types conflict with the
        // schema's existing types.
        var typeName = def.name.value;
        if (schema.getType(typeName)) {
          throw new _GraphQLError.GraphQLError('Type "' + typeName + '" already exists in the schema. It cannot also ' + 'be defined in this type definition.', [def]);
        }
        typeDefinitionMap[typeName] = def;
        break;
      case Kind.TYPE_EXTENSION_DEFINITION:
        // Sanity check that this type extension exists within the
        // schema's existing types.
        var extendedTypeName = def.definition.name.value;
        var existingType = schema.getType(extendedTypeName);
        if (!existingType) {
          throw new _GraphQLError.GraphQLError('Cannot extend type "' + extendedTypeName + '" because it does not ' + 'exist in the existing schema.', [def.definition]);
        }
        if (!(existingType instanceof _definition.GraphQLObjectType)) {
          throw new _GraphQLError.GraphQLError('Cannot extend non-object type "' + extendedTypeName + '".', [def.definition]);
        }
        var extensions = typeExtensionsMap[extendedTypeName];
        if (extensions) {
          extensions.push(def);
        } else {
          extensions = [def];
        }
        typeExtensionsMap[extendedTypeName] = extensions;
        break;
      case Kind.DIRECTIVE_DEFINITION:
        var directiveName = def.name.value;
        var existingDirective = schema.getDirective(directiveName);
        if (existingDirective) {
          throw new _GraphQLError.GraphQLError('Directive "' + directiveName + '" already exists in the schema. It ' + 'cannot be redefined.', [def]);
        }
        directiveDefinitions.push(def);
        break;
    }
  }

  // If this document contains no new types, extensions, or directives then
  // return the same unmodified GraphQLSchema instance.
  if (Object.keys(typeExtensionsMap).length === 0 && Object.keys(typeDefinitionMap).length === 0 && directiveDefinitions.length === 0) {
    return schema;
  }

  // A cache to use to store the actual GraphQLType definition objects by name.
  // Initialize to the GraphQL built in scalars and introspection types. All
  // functions below are inline so that this type def cache is within the scope
  // of the closure.
  var typeDefCache = {
    String: _scalars.GraphQLString,
    Int: _scalars.GraphQLInt,
    Float: _scalars.GraphQLFloat,
    Boolean: _scalars.GraphQLBoolean,
    ID: _scalars.GraphQLID,
    __Schema: _introspection.__Schema,
    __Directive: _introspection.__Directive,
    __DirectiveLocation: _introspection.__DirectiveLocation,
    __Type: _introspection.__Type,
    __Field: _introspection.__Field,
    __InputValue: _introspection.__InputValue,
    __EnumValue: _introspection.__EnumValue,
    __TypeKind: _introspection.__TypeKind
  };

  // Get the root Query, Mutation, and Subscription object types.
  var queryType = getTypeFromDef(schema.getQueryType());

  var existingMutationType = schema.getMutationType();
  var mutationType = existingMutationType ? getTypeFromDef(existingMutationType) : null;

  var existingSubscriptionType = schema.getSubscriptionType();
  var subscriptionType = existingSubscriptionType ? getTypeFromDef(existingSubscriptionType) : null;

  // Iterate through all types, getting the type definition for each, ensuring
  // that any type not directly referenced by a field will get created.
  var typeMap = schema.getTypeMap();
  var types = Object.keys(typeMap).map(function (typeName) {
    return getTypeFromDef(typeMap[typeName]);
  });

  // Do the same with new types, appending to the list of defined types.
  Object.keys(typeDefinitionMap).forEach(function (typeName) {
    types.push(getTypeFromAST(typeDefinitionMap[typeName]));
  });

  // Then produce and return a Schema with these types.
  return new _schema.GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    subscription: subscriptionType,
    types: types,
    directives: getMergedDirectives()
  });

  // Below are functions used for producing this schema that have closed over
  // this scope and have access to the schema, cache, and newly defined types.

  function getMergedDirectives() {
    var existingDirectives = schema.getDirectives();
    (0, _invariant2.default)(existingDirectives, 'schema must have default directives');

    var newDirectives = directiveDefinitions.map(function (directiveNode) {
      return getDirective(directiveNode);
    });
    return existingDirectives.concat(newDirectives);
  }

  function getTypeFromDef(typeDef) {
    var type = _getNamedType(typeDef.name);
    (0, _invariant2.default)(type, 'Missing type from schema');
    return type;
  }

  function getTypeFromAST(node) {
    var type = _getNamedType(node.name.value);
    if (!type) {
      throw new _GraphQLError.GraphQLError('Unknown type: "' + node.name.value + '". Ensure that this type exists ' + 'either in the original schema, or is added in a type definition.', [node]);
    }
    return type;
  }

  function getObjectTypeFromAST(node) {
    var type = getTypeFromAST(node);
    (0, _invariant2.default)(type instanceof _definition.GraphQLObjectType, 'Must be Object type.');
    return type;
  }

  function getInterfaceTypeFromAST(node) {
    var type = getTypeFromAST(node);
    (0, _invariant2.default)(type instanceof _definition.GraphQLInterfaceType, 'Must be Interface type.');
    return type;
  }

  function getInputTypeFromAST(node) {
    return (0, _definition.assertInputType)(getTypeFromAST(node));
  }

  function getOutputTypeFromAST(node) {
    return (0, _definition.assertOutputType)(getTypeFromAST(node));
  }

  // Given a name, returns a type from either the existing schema or an
  // added type.
  function _getNamedType(typeName) {
    var cachedTypeDef = typeDefCache[typeName];
    if (cachedTypeDef) {
      return cachedTypeDef;
    }

    var existingType = schema.getType(typeName);
    if (existingType) {
      var typeDef = extendType(existingType);
      typeDefCache[typeName] = typeDef;
      return typeDef;
    }

    var typeNode = typeDefinitionMap[typeName];
    if (typeNode) {
      var _typeDef = buildType(typeNode);
      typeDefCache[typeName] = _typeDef;
      return _typeDef;
    }
  }

  // Given a type's introspection result, construct the correct
  // GraphQLType instance.
  function extendType(type) {
    if (type instanceof _definition.GraphQLObjectType) {
      return extendObjectType(type);
    }
    if (type instanceof _definition.GraphQLInterfaceType) {
      return extendInterfaceType(type);
    }
    if (type instanceof _definition.GraphQLUnionType) {
      return extendUnionType(type);
    }
    return type;
  }

  function extendObjectType(type) {
    return new _definition.GraphQLObjectType({
      name: type.name,
      description: type.description,
      interfaces: function interfaces() {
        return extendImplementedInterfaces(type);
      },
      fields: function fields() {
        return extendFieldMap(type);
      },
      isTypeOf: type.isTypeOf
    });
  }

  function extendInterfaceType(type) {
    return new _definition.GraphQLInterfaceType({
      name: type.name,
      description: type.description,
      fields: function fields() {
        return extendFieldMap(type);
      },
      resolveType: type.resolveType
    });
  }

  function extendUnionType(type) {
    return new _definition.GraphQLUnionType({
      name: type.name,
      description: type.description,
      types: type.getTypes().map(getTypeFromDef),
      resolveType: type.resolveType
    });
  }

  function extendImplementedInterfaces(type) {
    var interfaces = type.getInterfaces().map(getTypeFromDef);

    // If there are any extensions to the interfaces, apply those here.
    var extensions = typeExtensionsMap[type.name];
    if (extensions) {
      extensions.forEach(function (extension) {
        extension.definition.interfaces.forEach(function (namedType) {
          var interfaceName = namedType.name.value;
          if (interfaces.some(function (def) {
            return def.name === interfaceName;
          })) {
            throw new _GraphQLError.GraphQLError('Type "' + type.name + '" already implements "' + interfaceName + '". ' + 'It cannot also be implemented in this type extension.', [namedType]);
          }
          interfaces.push(getInterfaceTypeFromAST(namedType));
        });
      });
    }

    return interfaces;
  }

  function extendFieldMap(type) {
    var newFieldMap = Object.create(null);
    var oldFieldMap = type.getFields();
    Object.keys(oldFieldMap).forEach(function (fieldName) {
      var field = oldFieldMap[fieldName];
      newFieldMap[fieldName] = {
        description: field.description,
        deprecationReason: field.deprecationReason,
        type: extendFieldType(field.type),
        args: (0, _keyMap2.default)(field.args, function (arg) {
          return arg.name;
        }),
        resolve: field.resolve
      };
    });

    // If there are any extensions to the fields, apply those here.
    var extensions = typeExtensionsMap[type.name];
    if (extensions) {
      extensions.forEach(function (extension) {
        extension.definition.fields.forEach(function (field) {
          var fieldName = field.name.value;
          if (oldFieldMap[fieldName]) {
            throw new _GraphQLError.GraphQLError('Field "' + type.name + '.' + fieldName + '" already exists in the ' + 'schema. It cannot also be defined in this type extension.', [field]);
          }
          newFieldMap[fieldName] = {
            description: (0, _buildASTSchema.getDescription)(field),
            type: buildOutputFieldType(field.type),
            args: buildInputValues(field.arguments),
            deprecationReason: (0, _buildASTSchema.getDeprecationReason)(field)
          };
        });
      });
    }

    return newFieldMap;
  }

  function extendFieldType(typeDef) {
    if (typeDef instanceof _definition.GraphQLList) {
      return new _definition.GraphQLList(extendFieldType(typeDef.ofType));
    }
    if (typeDef instanceof _definition.GraphQLNonNull) {
      return new _definition.GraphQLNonNull(extendFieldType(typeDef.ofType));
    }
    return getTypeFromDef(typeDef);
  }

  function buildType(typeNode) {
    switch (typeNode.kind) {
      case Kind.OBJECT_TYPE_DEFINITION:
        return buildObjectType(typeNode);
      case Kind.INTERFACE_TYPE_DEFINITION:
        return buildInterfaceType(typeNode);
      case Kind.UNION_TYPE_DEFINITION:
        return buildUnionType(typeNode);
      case Kind.SCALAR_TYPE_DEFINITION:
        return buildScalarType(typeNode);
      case Kind.ENUM_TYPE_DEFINITION:
        return buildEnumType(typeNode);
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        return buildInputObjectType(typeNode);
    }
    throw new TypeError('Unknown type kind ' + typeNode.kind);
  }

  function buildObjectType(typeNode) {
    return new _definition.GraphQLObjectType({
      name: typeNode.name.value,
      description: (0, _buildASTSchema.getDescription)(typeNode),
      interfaces: function interfaces() {
        return buildImplementedInterfaces(typeNode);
      },
      fields: function fields() {
        return buildFieldMap(typeNode);
      }
    });
  }

  function buildInterfaceType(typeNode) {
    return new _definition.GraphQLInterfaceType({
      name: typeNode.name.value,
      description: (0, _buildASTSchema.getDescription)(typeNode),
      fields: function fields() {
        return buildFieldMap(typeNode);
      },
      resolveType: cannotExecuteExtendedSchema
    });
  }

  function buildUnionType(typeNode) {
    return new _definition.GraphQLUnionType({
      name: typeNode.name.value,
      description: (0, _buildASTSchema.getDescription)(typeNode),
      types: typeNode.types.map(getObjectTypeFromAST),
      resolveType: cannotExecuteExtendedSchema
    });
  }

  function buildScalarType(typeNode) {
    return new _definition.GraphQLScalarType({
      name: typeNode.name.value,
      description: (0, _buildASTSchema.getDescription)(typeNode),
      serialize: function serialize(id) {
        return id;
      },
      // Note: validation calls the parse functions to determine if a
      // literal value is correct. Returning null would cause use of custom
      // scalars to always fail validation. Returning false causes them to
      // always pass validation.
      parseValue: function parseValue() {
        return false;
      },
      parseLiteral: function parseLiteral() {
        return false;
      }
    });
  }

  function buildEnumType(typeNode) {
    return new _definition.GraphQLEnumType({
      name: typeNode.name.value,
      description: (0, _buildASTSchema.getDescription)(typeNode),
      values: (0, _keyValMap2.default)(typeNode.values, function (enumValue) {
        return enumValue.name.value;
      }, function (enumValue) {
        return {
          description: (0, _buildASTSchema.getDescription)(enumValue),
          deprecationReason: (0, _buildASTSchema.getDeprecationReason)(enumValue)
        };
      })
    });
  }

  function buildInputObjectType(typeNode) {
    return new _definition.GraphQLInputObjectType({
      name: typeNode.name.value,
      description: (0, _buildASTSchema.getDescription)(typeNode),
      fields: function fields() {
        return buildInputValues(typeNode.fields);
      }
    });
  }

  function getDirective(directiveNode) {
    return new _directives.GraphQLDirective({
      name: directiveNode.name.value,
      locations: directiveNode.locations.map(function (node) {
        return node.value;
      }),
      args: directiveNode.arguments && buildInputValues(directiveNode.arguments)
    });
  }

  function buildImplementedInterfaces(typeNode) {
    return typeNode.interfaces && typeNode.interfaces.map(getInterfaceTypeFromAST);
  }

  function buildFieldMap(typeNode) {
    return (0, _keyValMap2.default)(typeNode.fields, function (field) {
      return field.name.value;
    }, function (field) {
      return {
        type: buildOutputFieldType(field.type),
        description: (0, _buildASTSchema.getDescription)(field),
        args: buildInputValues(field.arguments),
        deprecationReason: (0, _buildASTSchema.getDeprecationReason)(field)
      };
    });
  }

  function buildInputValues(values) {
    return (0, _keyValMap2.default)(values, function (value) {
      return value.name.value;
    }, function (value) {
      var type = buildInputFieldType(value.type);
      return {
        type: type,
        description: (0, _buildASTSchema.getDescription)(value),
        defaultValue: (0, _valueFromAST.valueFromAST)(value.defaultValue, type)
      };
    });
  }

  function buildInputFieldType(typeNode) {
    if (typeNode.kind === Kind.LIST_TYPE) {
      return new _definition.GraphQLList(buildInputFieldType(typeNode.type));
    }
    if (typeNode.kind === Kind.NON_NULL_TYPE) {
      var nullableType = buildInputFieldType(typeNode.type);
      (0, _invariant2.default)(!(nullableType instanceof _definition.GraphQLNonNull), 'Must be nullable');
      return new _definition.GraphQLNonNull(nullableType);
    }
    return getInputTypeFromAST(typeNode);
  }

  function buildOutputFieldType(typeNode) {
    if (typeNode.kind === Kind.LIST_TYPE) {
      return new _definition.GraphQLList(buildOutputFieldType(typeNode.type));
    }
    if (typeNode.kind === Kind.NON_NULL_TYPE) {
      var nullableType = buildOutputFieldType(typeNode.type);
      (0, _invariant2.default)(!(nullableType instanceof _definition.GraphQLNonNull), 'Must be nullable');
      return new _definition.GraphQLNonNull(nullableType);
    }
    return getOutputTypeFromAST(typeNode);
  }
}

function cannotExecuteExtendedSchema() {
  throw new Error('Extended Schema cannot use Interface or Union types for execution.');
}

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printSchema = printSchema;
exports.printIntrospectionSchema = printIntrospectionSchema;
exports.printType = printType;

var _invariant = __webpack_require__(3);

var _invariant2 = _interopRequireDefault(_invariant);

var _isNullish = __webpack_require__(14);

var _isNullish2 = _interopRequireDefault(_isNullish);

var _isInvalid = __webpack_require__(27);

var _isInvalid2 = _interopRequireDefault(_isInvalid);

var _astFromValue = __webpack_require__(51);

var _printer = __webpack_require__(7);

var _definition = __webpack_require__(1);

var _scalars = __webpack_require__(12);

var _directives = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function printSchema(schema) {
  return printFilteredSchema(schema, function (n) {
    return !isSpecDirective(n);
  }, isDefinedType);
}

function printIntrospectionSchema(schema) {
  return printFilteredSchema(schema, isSpecDirective, isIntrospectionType);
}

function isSpecDirective(directiveName) {
  return directiveName === 'skip' || directiveName === 'include' || directiveName === 'deprecated';
}

function isDefinedType(typename) {
  return !isIntrospectionType(typename) && !isBuiltInScalar(typename);
}

function isIntrospectionType(typename) {
  return typename.indexOf('__') === 0;
}

function isBuiltInScalar(typename) {
  return typename === 'String' || typename === 'Boolean' || typename === 'Int' || typename === 'Float' || typename === 'ID';
}

function printFilteredSchema(schema, directiveFilter, typeFilter) {
  var directives = schema.getDirectives().filter(function (directive) {
    return directiveFilter(directive.name);
  });
  var typeMap = schema.getTypeMap();
  var types = Object.keys(typeMap).filter(typeFilter).sort(function (name1, name2) {
    return name1.localeCompare(name2);
  }).map(function (typeName) {
    return typeMap[typeName];
  });

  return [printSchemaDefinition(schema)].concat(directives.map(printDirective), types.map(printType)).filter(Boolean).join('\n\n') + '\n';
}

function printSchemaDefinition(schema) {
  if (isSchemaOfCommonNames(schema)) {
    return;
  }

  var operationTypes = [];

  var queryType = schema.getQueryType();
  if (queryType) {
    operationTypes.push('  query: ' + queryType.name);
  }

  var mutationType = schema.getMutationType();
  if (mutationType) {
    operationTypes.push('  mutation: ' + mutationType.name);
  }

  var subscriptionType = schema.getSubscriptionType();
  if (subscriptionType) {
    operationTypes.push('  subscription: ' + subscriptionType.name);
  }

  return 'schema {\n' + operationTypes.join('\n') + '\n}';
}

/**
 * GraphQL schema define root types for each type of operation. These types are
 * the same as any other type and can be named in any manner, however there is
 * a common naming convention:
 *
 *   schema {
 *     query: Query
 *     mutation: Mutation
 *   }
 *
 * When using this naming convention, the schema description can be omitted.
 */
function isSchemaOfCommonNames(schema) {
  var queryType = schema.getQueryType();
  if (queryType && queryType.name !== 'Query') {
    return false;
  }

  var mutationType = schema.getMutationType();
  if (mutationType && mutationType.name !== 'Mutation') {
    return false;
  }

  var subscriptionType = schema.getSubscriptionType();
  if (subscriptionType && subscriptionType.name !== 'Subscription') {
    return false;
  }

  return true;
}

function printType(type) {
  if (type instanceof _definition.GraphQLScalarType) {
    return printScalar(type);
  } else if (type instanceof _definition.GraphQLObjectType) {
    return printObject(type);
  } else if (type instanceof _definition.GraphQLInterfaceType) {
    return printInterface(type);
  } else if (type instanceof _definition.GraphQLUnionType) {
    return printUnion(type);
  } else if (type instanceof _definition.GraphQLEnumType) {
    return printEnum(type);
  }
  (0, _invariant2.default)(type instanceof _definition.GraphQLInputObjectType);
  return printInputObject(type);
}

function printScalar(type) {
  return printDescription(type) + ('scalar ' + type.name);
}

function printObject(type) {
  var interfaces = type.getInterfaces();
  var implementedInterfaces = interfaces.length ? ' implements ' + interfaces.map(function (i) {
    return i.name;
  }).join(', ') : '';
  return printDescription(type) + ('type ' + type.name + implementedInterfaces + ' {\n') + printFields(type) + '\n' + '}';
}

function printInterface(type) {
  return printDescription(type) + ('interface ' + type.name + ' {\n') + printFields(type) + '\n' + '}';
}

function printUnion(type) {
  return printDescription(type) + ('union ' + type.name + ' = ' + type.getTypes().join(' | '));
}

function printEnum(type) {
  return printDescription(type) + ('enum ' + type.name + ' {\n') + printEnumValues(type.getValues()) + '\n' + '}';
}

function printEnumValues(values) {
  return values.map(function (value, i) {
    return printDescription(value, '  ', !i) + '  ' + value.name + printDeprecated(value);
  }).join('\n');
}

function printInputObject(type) {
  var fieldMap = type.getFields();
  var fields = Object.keys(fieldMap).map(function (fieldName) {
    return fieldMap[fieldName];
  });
  return printDescription(type) + ('input ' + type.name + ' {\n') + fields.map(function (f, i) {
    return printDescription(f, '  ', !i) + '  ' + printInputValue(f);
  }).join('\n') + '\n' + '}';
}

function printFields(type) {
  var fieldMap = type.getFields();
  var fields = Object.keys(fieldMap).map(function (fieldName) {
    return fieldMap[fieldName];
  });
  return fields.map(function (f, i) {
    return printDescription(f, '  ', !i) + '  ' + f.name + printArgs(f.args, '  ') + ': ' + String(f.type) + printDeprecated(f);
  }).join('\n');
}

function printArgs(args) {
  var indentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (args.length === 0) {
    return '';
  }

  // If every arg does not have a description, print them on one line.
  if (args.every(function (arg) {
    return !arg.description;
  })) {
    return '(' + args.map(printInputValue).join(', ') + ')';
  }

  return '(\n' + args.map(function (arg, i) {
    return printDescription(arg, '  ' + indentation, !i) + '  ' + indentation + printInputValue(arg);
  }).join('\n') + '\n' + indentation + ')';
}

function printInputValue(arg) {
  var argDecl = arg.name + ': ' + String(arg.type);
  if (!(0, _isInvalid2.default)(arg.defaultValue)) {
    argDecl += ' = ' + (0, _printer.print)((0, _astFromValue.astFromValue)(arg.defaultValue, arg.type));
  }
  return argDecl;
}

function printDirective(directive) {
  return printDescription(directive) + 'directive @' + directive.name + printArgs(directive.args) + ' on ' + directive.locations.join(' | ');
}

function printDeprecated(fieldOrEnumVal) {
  var reason = fieldOrEnumVal.deprecationReason;
  if ((0, _isNullish2.default)(reason)) {
    return '';
  }
  if (reason === '' || reason === _directives.DEFAULT_DEPRECATION_REASON) {
    return ' @deprecated';
  }
  return ' @deprecated(reason: ' + (0, _printer.print)((0, _astFromValue.astFromValue)(reason, _scalars.GraphQLString)) + ')';
}

function printDescription(def) {
  var indentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var firstInBlock = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!def.description) {
    return '';
  }
  var lines = def.description.split('\n');
  var description = indentation && !firstInBlock ? '\n' : '';
  for (var i = 0; i < lines.length; i++) {
    if (lines[i] === '') {
      description += indentation + '#\n';
    } else {
      // For > 120 character long lines, cut at space boundaries into sublines
      // of ~80 chars.
      var sublines = breakLine(lines[i], 120 - indentation.length);
      for (var j = 0; j < sublines.length; j++) {
        description += indentation + '# ' + sublines[j] + '\n';
      }
    }
  }
  return description;
}

function breakLine(line, len) {
  if (line.length < len + 5) {
    return [line];
  }
  var parts = line.split(new RegExp('((?: |^).{15,' + (len - 40) + '}(?= |$))'));
  if (parts.length < 4) {
    return [line];
  }
  var sublines = [parts[0] + parts[1] + parts[2]];
  for (var i = 3; i < parts.length; i += 2) {
    sublines.push(parts[i].slice(1) + parts[i + 1]);
  }
  return sublines;
}

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatAST = concatAST;


/**
 * Provided a collection of ASTs, presumably each from different files,
 * concatenate the ASTs together into batched AST, useful for validating many
 * GraphQL source files which together represent one conceptual application.
 */
function concatAST(asts) {
  var batchDefinitions = [];
  for (var i = 0; i < asts.length; i++) {
    var definitions = asts[i].definitions;
    for (var j = 0; j < definitions.length; j++) {
      batchDefinitions.push(definitions[j]);
    }
  }
  return {
    kind: 'Document',
    definitions: batchDefinitions
  };
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.separateOperations = separateOperations;

var _visitor = __webpack_require__(26);

/**
 * separateOperations accepts a single AST document which may contain many
 * operations and fragments and returns a collection of AST documents each of
 * which contains a single operation as well the fragment definitions it
 * refers to.
 */
function separateOperations(documentAST) {

  var operations = [];
  var fragments = Object.create(null);
  var positions = new Map();
  var depGraph = Object.create(null);
  var fromName = void 0;
  var idx = 0;

  // Populate metadata and build a dependency graph.
  (0, _visitor.visit)(documentAST, {
    OperationDefinition: function OperationDefinition(node) {
      fromName = opName(node);
      operations.push(node);
      positions.set(node, idx++);
    },
    FragmentDefinition: function FragmentDefinition(node) {
      fromName = node.name.value;
      fragments[fromName] = node;
      positions.set(node, idx++);
    },
    FragmentSpread: function FragmentSpread(node) {
      var toName = node.name.value;
      (depGraph[fromName] || (depGraph[fromName] = Object.create(null)))[toName] = true;
    }
  });

  // For each operation, produce a new synthesized AST which includes only what
  // is necessary for completing that operation.
  var separatedDocumentASTs = Object.create(null);
  operations.forEach(function (operation) {
    var operationName = opName(operation);
    var dependencies = Object.create(null);
    collectTransitiveDependencies(dependencies, depGraph, operationName);

    // The list of definition nodes to be included for this operation, sorted
    // to retain the same order as the original document.
    var definitions = [operation];
    Object.keys(dependencies).forEach(function (name) {
      definitions.push(fragments[name]);
    });
    definitions.sort(function (n1, n2) {
      return (positions.get(n1) || 0) - (positions.get(n2) || 0);
    });

    separatedDocumentASTs[operationName] = {
      kind: 'Document',
      definitions: definitions
    };
  });

  return separatedDocumentASTs;
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Provides the empty string for anonymous operations.
function opName(operation) {
  return operation.name ? operation.name.value : '';
}

// From a dependency graph, collects a list of transitive dependencies by
// recursing through a dependency graph.
function collectTransitiveDependencies(collected, depGraph, fromName) {
  var immediateDeps = depGraph[fromName];
  if (immediateDeps) {
    Object.keys(immediateDeps).forEach(function (toName) {
      if (!collected[toName]) {
        collected[toName] = true;
        collectTransitiveDependencies(collected, depGraph, toName);
      }
    });
  }
}

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DangerousChangeType = exports.BreakingChangeType = undefined;
exports.findBreakingChanges = findBreakingChanges;
exports.findDangerousChanges = findDangerousChanges;
exports.findRemovedTypes = findRemovedTypes;
exports.findTypesThatChangedKind = findTypesThatChangedKind;
exports.findArgChanges = findArgChanges;
exports.findFieldsThatChangedType = findFieldsThatChangedType;
exports.findFieldsThatChangedTypeOnInputObjectTypes = findFieldsThatChangedTypeOnInputObjectTypes;
exports.findTypesRemovedFromUnions = findTypesRemovedFromUnions;
exports.findValuesRemovedFromEnums = findValuesRemovedFromEnums;
exports.findInterfacesRemovedFromObjectTypes = findInterfacesRemovedFromObjectTypes;

var _definition = __webpack_require__(1);

var _schema = __webpack_require__(9);

/**
 *  Copyright (c) 2016, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var BreakingChangeType = exports.BreakingChangeType = {
  FIELD_CHANGED_KIND: 'FIELD_CHANGED_KIND',
  FIELD_REMOVED: 'FIELD_REMOVED',
  TYPE_CHANGED_KIND: 'TYPE_CHANGED_KIND',
  TYPE_REMOVED: 'TYPE_REMOVED',
  TYPE_REMOVED_FROM_UNION: 'TYPE_REMOVED_FROM_UNION',
  VALUE_REMOVED_FROM_ENUM: 'VALUE_REMOVED_FROM_ENUM',
  ARG_REMOVED: 'ARG_REMOVED',
  ARG_CHANGED_KIND: 'ARG_CHANGED_KIND',
  NON_NULL_ARG_ADDED: 'NON_NULL_ARG_ADDED',
  NON_NULL_INPUT_FIELD_ADDED: 'NON_NULL_INPUT_FIELD_ADDED',
  INTERFACE_REMOVED_FROM_OBJECT: 'INTERFACE_REMOVED_FROM_OBJECT'
};

var DangerousChangeType = exports.DangerousChangeType = {
  ARG_DEFAULT_VALUE_CHANGE: 'ARG_DEFAULT_VALUE_CHANGE'
};

/**
 * Given two schemas, returns an Array containing descriptions of all the types
 * of breaking changes covered by the other functions down below.
 */
function findBreakingChanges(oldSchema, newSchema) {
  return [].concat(findRemovedTypes(oldSchema, newSchema), findTypesThatChangedKind(oldSchema, newSchema), findFieldsThatChangedType(oldSchema, newSchema), findTypesRemovedFromUnions(oldSchema, newSchema), findValuesRemovedFromEnums(oldSchema, newSchema), findArgChanges(oldSchema, newSchema).breakingChanges, findInterfacesRemovedFromObjectTypes(oldSchema, newSchema));
}

/**
 * Given two schemas, returns an Array containing descriptions of all the types
 * of potentially dangerous changes covered by the other functions down below.
 */
function findDangerousChanges(oldSchema, newSchema) {
  return [].concat(findArgChanges(oldSchema, newSchema).dangerousChanges);
}

/**
 * Given two schemas, returns an Array containing descriptions of any breaking
 * changes in the newSchema related to removing an entire type.
 */
function findRemovedTypes(oldSchema, newSchema) {
  var oldTypeMap = oldSchema.getTypeMap();
  var newTypeMap = newSchema.getTypeMap();

  var breakingChanges = [];
  Object.keys(oldTypeMap).forEach(function (typeName) {
    if (!newTypeMap[typeName]) {
      breakingChanges.push({
        type: BreakingChangeType.TYPE_REMOVED,
        description: typeName + ' was removed.'
      });
    }
  });
  return breakingChanges;
}

/**
 * Given two schemas, returns an Array containing descriptions of any breaking
 * changes in the newSchema related to changing the type of a type.
 */
function findTypesThatChangedKind(oldSchema, newSchema) {
  var oldTypeMap = oldSchema.getTypeMap();
  var newTypeMap = newSchema.getTypeMap();

  var breakingChanges = [];
  Object.keys(oldTypeMap).forEach(function (typeName) {
    if (!newTypeMap[typeName]) {
      return;
    }
    var oldType = oldTypeMap[typeName];
    var newType = newTypeMap[typeName];
    if (!(oldType instanceof newType.constructor)) {
      breakingChanges.push({
        type: BreakingChangeType.TYPE_CHANGED_KIND,
        description: typeName + ' changed from ' + (typeKindName(oldType) + ' to ' + typeKindName(newType) + '.')
      });
    }
  });
  return breakingChanges;
}

/**
 * Given two schemas, returns an Array containing descriptions of any
 * breaking or dangerous changes in the newSchema related to arguments
 * (such as removal or change of type of an argument, or a change in an
 * argument's default value).
 */
function findArgChanges(oldSchema, newSchema) {
  var oldTypeMap = oldSchema.getTypeMap();
  var newTypeMap = newSchema.getTypeMap();

  var breakingChanges = [];
  var dangerousChanges = [];

  Object.keys(oldTypeMap).forEach(function (typeName) {
    var oldType = oldTypeMap[typeName];
    var newType = newTypeMap[typeName];
    if (!(oldType instanceof _definition.GraphQLObjectType || oldType instanceof _definition.GraphQLInterfaceType) || !(newType instanceof oldType.constructor)) {
      return;
    }

    var oldTypeFields = oldType.getFields();
    var newTypeFields = newType.getFields();

    Object.keys(oldTypeFields).forEach(function (fieldName) {
      if (!newTypeFields[fieldName]) {
        return;
      }

      oldTypeFields[fieldName].args.forEach(function (oldArgDef) {
        var newArgs = newTypeFields[fieldName].args;
        var newArgDef = newArgs.find(function (arg) {
          return arg.name === oldArgDef.name;
        });

        // Arg not present
        if (!newArgDef) {
          breakingChanges.push({
            type: BreakingChangeType.ARG_REMOVED,
            description: oldType.name + '.' + fieldName + ' arg ' + (oldArgDef.name + ' was removed')
          });
        } else {
          var isSafe = isChangeSafeForInputObjectFieldOrFieldArg(oldArgDef.type, newArgDef.type);
          if (!isSafe) {
            breakingChanges.push({
              type: BreakingChangeType.ARG_CHANGED_KIND,
              description: oldType.name + '.' + fieldName + ' arg ' + (oldArgDef.name + ' has changed type from ') + (oldArgDef.type.toString() + ' to ' + newArgDef.type.toString())
            });
          } else if (oldArgDef.defaultValue !== undefined && oldArgDef.defaultValue !== newArgDef.defaultValue) {
            dangerousChanges.push({
              type: DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
              description: oldType.name + '.' + fieldName + ' arg ' + (oldArgDef.name + ' has changed defaultValue')
            });
          }
        }
      });
      // Check if a non-null arg was added to the field
      newTypeFields[fieldName].args.forEach(function (newArgDef) {
        var oldArgs = oldTypeFields[fieldName].args;
        var oldArgDef = oldArgs.find(function (arg) {
          return arg.name === newArgDef.name;
        });
        if (!oldArgDef && newArgDef.type instanceof _definition.GraphQLNonNull) {
          breakingChanges.push({
            type: BreakingChangeType.NON_NULL_ARG_ADDED,
            description: 'A non-null arg ' + newArgDef.name + ' on ' + (newType.name + '.' + fieldName + ' was added')
          });
        }
      });
    });
  });

  return {
    breakingChanges: breakingChanges,
    dangerousChanges: dangerousChanges
  };
}

function typeKindName(type) {
  if (type instanceof _definition.GraphQLScalarType) {
    return 'a Scalar type';
  }
  if (type instanceof _definition.GraphQLObjectType) {
    return 'an Object type';
  }
  if (type instanceof _definition.GraphQLInterfaceType) {
    return 'an Interface type';
  }
  if (type instanceof _definition.GraphQLUnionType) {
    return 'a Union type';
  }
  if (type instanceof _definition.GraphQLEnumType) {
    return 'an Enum type';
  }
  if (type instanceof _definition.GraphQLInputObjectType) {
    return 'an Input type';
  }
  throw new TypeError('Unknown type ' + type.constructor.name);
}

/**
 * Given two schemas, returns an Array containing descriptions of any breaking
 * changes in the newSchema related to the fields on a type. This includes if
 * a field has been removed from a type, if a field has changed type, or if
 * a non-null field is added to an input type.
 */
function findFieldsThatChangedType(oldSchema, newSchema) {
  return [].concat(findFieldsThatChangedTypeOnObjectOrInterfaceTypes(oldSchema, newSchema), findFieldsThatChangedTypeOnInputObjectTypes(oldSchema, newSchema));
}

function findFieldsThatChangedTypeOnObjectOrInterfaceTypes(oldSchema, newSchema) {
  var oldTypeMap = oldSchema.getTypeMap();
  var newTypeMap = newSchema.getTypeMap();

  var breakingFieldChanges = [];
  Object.keys(oldTypeMap).forEach(function (typeName) {
    var oldType = oldTypeMap[typeName];
    var newType = newTypeMap[typeName];
    if (!(oldType instanceof _definition.GraphQLObjectType || oldType instanceof _definition.GraphQLInterfaceType) || !(newType instanceof oldType.constructor)) {
      return;
    }

    var oldTypeFieldsDef = oldType.getFields();
    var newTypeFieldsDef = newType.getFields();
    Object.keys(oldTypeFieldsDef).forEach(function (fieldName) {
      // Check if the field is missing on the type in the new schema.
      if (!(fieldName in newTypeFieldsDef)) {
        breakingFieldChanges.push({
          type: BreakingChangeType.FIELD_REMOVED,
          description: typeName + '.' + fieldName + ' was removed.'
        });
      } else {
        var oldFieldType = oldTypeFieldsDef[fieldName].type;
        var newFieldType = newTypeFieldsDef[fieldName].type;
        var isSafe = isChangeSafeForObjectOrInterfaceField(oldFieldType, newFieldType);
        if (!isSafe) {
          var oldFieldTypeString = (0, _definition.isNamedType)(oldFieldType) ? oldFieldType.name : oldFieldType.toString();
          var newFieldTypeString = (0, _definition.isNamedType)(newFieldType) ? newFieldType.name : newFieldType.toString();
          breakingFieldChanges.push({
            type: BreakingChangeType.FIELD_CHANGED_KIND,
            description: typeName + '.' + fieldName + ' changed type from ' + (oldFieldTypeString + ' to ' + newFieldTypeString + '.')
          });
        }
      }
    });
  });
  return breakingFieldChanges;
}

function findFieldsThatChangedTypeOnInputObjectTypes(oldSchema, newSchema) {
  var oldTypeMap = oldSchema.getTypeMap();
  var newTypeMap = newSchema.getTypeMap();

  var breakingFieldChanges = [];
  Object.keys(oldTypeMap).forEach(function (typeName) {
    var oldType = oldTypeMap[typeName];
    var newType = newTypeMap[typeName];
    if (!(oldType instanceof _definition.GraphQLInputObjectType) || !(newType instanceof _definition.GraphQLInputObjectType)) {
      return;
    }

    var oldTypeFieldsDef = oldType.getFields();
    var newTypeFieldsDef = newType.getFields();
    Object.keys(oldTypeFieldsDef).forEach(function (fieldName) {
      // Check if the field is missing on the type in the new schema.
      if (!(fieldName in newTypeFieldsDef)) {
        breakingFieldChanges.push({
          type: BreakingChangeType.FIELD_REMOVED,
          description: typeName + '.' + fieldName + ' was removed.'
        });
      } else {
        var oldFieldType = oldTypeFieldsDef[fieldName].type;
        var newFieldType = newTypeFieldsDef[fieldName].type;

        var isSafe = isChangeSafeForInputObjectFieldOrFieldArg(oldFieldType, newFieldType);
        if (!isSafe) {
          var oldFieldTypeString = (0, _definition.isNamedType)(oldFieldType) ? oldFieldType.name : oldFieldType.toString();
          var newFieldTypeString = (0, _definition.isNamedType)(newFieldType) ? newFieldType.name : newFieldType.toString();
          breakingFieldChanges.push({
            type: BreakingChangeType.FIELD_CHANGED_KIND,
            description: typeName + '.' + fieldName + ' changed type from ' + (oldFieldTypeString + ' to ' + newFieldTypeString + '.')
          });
        }
      }
    });
    // Check if a non-null field was added to the input object type
    Object.keys(newTypeFieldsDef).forEach(function (fieldName) {
      if (!(fieldName in oldTypeFieldsDef) && newTypeFieldsDef[fieldName].type instanceof _definition.GraphQLNonNull) {
        breakingFieldChanges.push({
          type: BreakingChangeType.NON_NULL_INPUT_FIELD_ADDED,
          description: 'A non-null field ' + fieldName + ' on ' + ('input type ' + newType.name + ' was added.')
        });
      }
    });
  });
  return breakingFieldChanges;
}

function isChangeSafeForObjectOrInterfaceField(oldType, newType) {
  if ((0, _definition.isNamedType)(oldType)) {
    return (
      // if they're both named types, see if their names are equivalent
      (0, _definition.isNamedType)(newType) && oldType.name === newType.name ||
      // moving from nullable to non-null of the same underlying type is safe
      newType instanceof _definition.GraphQLNonNull && isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType)
    );
  } else if (oldType instanceof _definition.GraphQLList) {
    return (
      // if they're both lists, make sure the underlying types are compatible
      newType instanceof _definition.GraphQLList && isChangeSafeForObjectOrInterfaceField(oldType.ofType, newType.ofType) ||
      // moving from nullable to non-null of the same underlying type is safe
      newType instanceof _definition.GraphQLNonNull && isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType)
    );
  } else if (oldType instanceof _definition.GraphQLNonNull) {
    // if they're both non-null, make sure the underlying types are compatible
    return newType instanceof _definition.GraphQLNonNull && isChangeSafeForObjectOrInterfaceField(oldType.ofType, newType.ofType);
  }
  return false;
}

function isChangeSafeForInputObjectFieldOrFieldArg(oldType, newType) {
  if ((0, _definition.isNamedType)(oldType)) {
    // if they're both named types, see if their names are equivalent
    return (0, _definition.isNamedType)(newType) && oldType.name === newType.name;
  } else if (oldType instanceof _definition.GraphQLList) {
    // if they're both lists, make sure the underlying types are compatible
    return newType instanceof _definition.GraphQLList && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType.ofType);
  } else if (oldType instanceof _definition.GraphQLNonNull) {
    return (
      // if they're both non-null, make sure the underlying types are
      // compatible
      newType instanceof _definition.GraphQLNonNull && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType.ofType) ||
      // moving from non-null to nullable of the same underlying type is safe
      !(newType instanceof _definition.GraphQLNonNull) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType)
    );
  }
  return false;
}

/**
 * Given two schemas, returns an Array containing descriptions of any breaking
 * changes in the newSchema related to removing types from a union type.
 */
function findTypesRemovedFromUnions(oldSchema, newSchema) {
  var oldTypeMap = oldSchema.getTypeMap();
  var newTypeMap = newSchema.getTypeMap();

  var typesRemovedFromUnion = [];
  Object.keys(oldTypeMap).forEach(function (typeName) {
    var oldType = oldTypeMap[typeName];
    var newType = newTypeMap[typeName];
    if (!(oldType instanceof _definition.GraphQLUnionType) || !(newType instanceof _definition.GraphQLUnionType)) {
      return;
    }
    var typeNamesInNewUnion = Object.create(null);
    newType.getTypes().forEach(function (type) {
      typeNamesInNewUnion[type.name] = true;
    });
    oldType.getTypes().forEach(function (type) {
      if (!typeNamesInNewUnion[type.name]) {
        typesRemovedFromUnion.push({
          type: BreakingChangeType.TYPE_REMOVED_FROM_UNION,
          description: type.name + ' was removed from union type ' + typeName + '.'
        });
      }
    });
  });
  return typesRemovedFromUnion;
}

/**
 * Given two schemas, returns an Array containing descriptions of any breaking
 * changes in the newSchema related to removing values from an enum type.
 */
function findValuesRemovedFromEnums(oldSchema, newSchema) {
  var oldTypeMap = oldSchema.getTypeMap();
  var newTypeMap = newSchema.getTypeMap();

  var valuesRemovedFromEnums = [];
  Object.keys(oldTypeMap).forEach(function (typeName) {
    var oldType = oldTypeMap[typeName];
    var newType = newTypeMap[typeName];
    if (!(oldType instanceof _definition.GraphQLEnumType) || !(newType instanceof _definition.GraphQLEnumType)) {
      return;
    }
    var valuesInNewEnum = Object.create(null);
    newType.getValues().forEach(function (value) {
      valuesInNewEnum[value.name] = true;
    });
    oldType.getValues().forEach(function (value) {
      if (!valuesInNewEnum[value.name]) {
        valuesRemovedFromEnums.push({
          type: BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
          description: value.name + ' was removed from enum type ' + typeName + '.'
        });
      }
    });
  });
  return valuesRemovedFromEnums;
}

function findInterfacesRemovedFromObjectTypes(oldSchema, newSchema) {
  var oldTypeMap = oldSchema.getTypeMap();
  var newTypeMap = newSchema.getTypeMap();
  var breakingChanges = [];

  Object.keys(oldTypeMap).forEach(function (typeName) {
    var oldType = oldTypeMap[typeName];
    var newType = newTypeMap[typeName];
    if (!(oldType instanceof _definition.GraphQLObjectType) || !(newType instanceof _definition.GraphQLObjectType)) {
      return;
    }

    var oldInterfaces = oldType.getInterfaces();
    var newInterfaces = newType.getInterfaces();
    oldInterfaces.forEach(function (oldInterface) {
      if (!newInterfaces.some(function (int) {
        return int.name === oldInterface.name;
      })) {
        breakingChanges.push({
          type: BreakingChangeType.INTERFACE_REMOVED_FROM_OBJECT,
          description: typeName + ' no longer implements interface ' + (oldInterface.name + '.')
        });
      }
    });
  });
  return breakingChanges;
}

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDeprecatedUsages = findDeprecatedUsages;

var _GraphQLError = __webpack_require__(25);

var _visitor = __webpack_require__(26);

var _definition = __webpack_require__(1);

var _schema = __webpack_require__(9);

var _TypeInfo = __webpack_require__(52);

/**
 * A validation rule which reports deprecated usages.
 *
 * Returns a list of GraphQLError instances describing each deprecated use.
 */
function findDeprecatedUsages(schema, ast) {
  var errors = [];
  var typeInfo = new _TypeInfo.TypeInfo(schema);

  (0, _visitor.visit)(ast, (0, _visitor.visitWithTypeInfo)(typeInfo, {
    Field: function Field(node) {
      var fieldDef = typeInfo.getFieldDef();
      if (fieldDef && fieldDef.isDeprecated) {
        var parentType = typeInfo.getParentType();
        if (parentType) {
          var reason = fieldDef.deprecationReason;
          errors.push(new _GraphQLError.GraphQLError('The field ' + parentType.name + '.' + fieldDef.name + ' is deprecated.' + (reason ? ' ' + reason : ''), [node]));
        }
      }
    },
    EnumValue: function EnumValue(node) {
      var enumVal = typeInfo.getEnumValue();
      if (enumVal && enumVal.isDeprecated) {
        var type = (0, _definition.getNamedType)(typeInfo.getInputType());
        if (type) {
          var reason = enumVal.deprecationReason;
          errors.push(new _GraphQLError.GraphQLError('The enum value ' + type.name + '.' + enumVal.name + ' is deprecated.' + (reason ? ' ' + reason : ''), [node]));
        }
      }
    }
  }));

  return errors;
}
/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mockjs = __webpack_require__(109);

var _mockjs2 = _interopRequireDefault(_mockjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mockjs2.default.mock('/graphql/articleList', {
  'list|6-15': [{
    'id|+1': 0,
    'title': '@title',
    'source': '@domain',
    'authorId': '@integer(0,10)'
  }]
});

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mockjs = __webpack_require__(109);

var _mockjs2 = _interopRequireDefault(_mockjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mockjs2.default.mock('/graphql/authorList', {
  'list|15': [{
    'id|+1': 0,
    'name': '@name'
  }]
});

/***/ })
/******/ ]);