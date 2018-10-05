/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const debug = require('debug')('concerto:modelmanager');

const SYSTEM_MODELS = require('../../lib/systemmodel');

module.exports = {
    addComposerSystemModels: (modelManager) => {
        SYSTEM_MODELS.forEach((SYSTEM_MODEL) => {
            debug('addComposerSystemModels', SYSTEM_MODEL);
            modelManager.addModelFile(SYSTEM_MODEL.contents, SYSTEM_MODEL.fileName, true, true);
        });

        // now validate all the models
        modelManager.validateModelFiles();
    },
};
