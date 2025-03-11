/** @odoo-module **/

import { session } from "@web/session";
import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.SdComments = publicWidget.Widget.extend({
    selector: '.sd_snippets_comments',
    init: function () {
        this._super.apply(this, arguments);
        this.rpc = this.bindService("rpc");
    },
    /**
     * @override
     */
    start() {
//        console.log('sd_snippets_comments', this.el, this.el.querySelector('.s_allow_columns'))
        // todo: This way the conditional view of the snippet is not working.
        //  I need to change it based on conditional view.
        //  I there is no user_id check, the browser will show an warning of session.
        this.el.querySelector('.comment_data').innerHTML = '';
        this._getComments()
            .then(data => {
                if(data.data && data.data.length){
                    this._loadComments(data)
                    this.el.querySelector('.comment_header').classList.remove('d-none')
                    this.el.querySelector('.comment_data').classList.remove('d-none')
                } else{
                    this.el.classList.remove('pt40')
                    this.el.classList.remove('pb40')
                }
            });

        return this._super(...arguments);

    },
    _loadComments(comments){
        console.log('_loadComments:', comments, )
//               this.el.querySelector('.s_allow_columns').innerHTML = '';
        let comment_lines = ''
        comments['data'].forEach(comment => {
        comment_lines += `
        <div class="bg-white">
            <div class="border rounded shadow p-1 p-md-4 my-4 ">
                <div class="h5 mx-2 mt-1">
                    ${comment['title']}
                </div>
                <div class="small mx-1 mx-md-3">
                    ${comment['date']}
                </div>
                <div class="border-bottom border-gray mx-1 mx-md-3 mb-3"></div>
                <div class="mx-1 mx-md-4">
                    ${comment['content']}
                </div>
            </div>
        </div>
        `
        })
            this.el.querySelector('.comment_data').innerHTML = `
            <div class="bg-white">
                ${comment_lines}
            </div>
            `;



    },
    async _getComments(){
        // todo: It can be replaced by route rpc. Check how to tack effect of conditional view on snippet options.
        return this.rpc('/sd_snippets/snippet/comments')
        .then(data => JSON.parse(data))
        .then(data => data)
        .catch(er => false);
    },
});

export default publicWidget.registry.SdComments;
