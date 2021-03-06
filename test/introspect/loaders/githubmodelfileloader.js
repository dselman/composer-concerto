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

const GitHubModelFileLoader = require('../../../lib/introspect/loaders/githubmodelfileloader');
const ModelManager = require('../../../lib/modelmanager');

const moxios = require('moxios');
const chai = require('chai');
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));
const sinon = require('sinon');

describe('GitHubModelFileLoader', () => {

    let modelManager;
    let sandbox;

    let model = `namespace org.accordproject.usa.business

    /**
     * Types of businesses in the USA
     * Taken from: https://en.wikipedia.org/wiki/List_of_business_entities#United_States
     */
    enum BusinessEntity {
      o GENERAL_PARTNERSHIP
      o LP
      o LLP
      o LLLP
      o LLC
      o PLLC
      o CORP
      o PC
      o DBA
    }`;

    beforeEach(() => {
        modelManager = new ModelManager();
        sandbox = sinon.sandbox.create();
        moxios.install();
    });

    afterEach(() => {
        sandbox.restore();
        moxios.uninstall();
    });

    describe('#accept', () => {

        it('should accept github URIs', () => {
            const ml = new GitHubModelFileLoader(modelManager);
            ml.accepts('github://goo').should.be.true;
        });

        it('should reject unknown URIs', () => {
            const ml = new GitHubModelFileLoader(modelManager);
            ml.accepts('foo://goo').should.be.false;
        });
    });

    describe('#load', () => {

        it('should load github URIs', () => {
            // Match against an exact URL value
            moxios.stubRequest('https://raw.githubusercontent.com/accordproject/models/master/usa/business.cto', {
                status: 200,
                responseText: model
            });

            const ml = new GitHubModelFileLoader(modelManager);
            return ml.load( 'github://accordproject/models/master/usa/business.cto', {foo: 'bar' })
                .then((mf) => {
                    mf.getDefinitions().should.be.deep.equal(model);
                });
        });
    });
});
