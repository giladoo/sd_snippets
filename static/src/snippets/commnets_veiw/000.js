/** @odoo-module **/

import { session } from "@web/session";
import publicWidget from "@web/legacy/js/public/public_widget";
import { rpc } from "@web/core/network/rpc";

publicWidget.registry.SdComments = publicWidget.Widget.extend({
    selector: '.sd_snippets_comments_views',
        events: {
        'click .comment_view_list_item': '_onListClick',
//        'click .comments_text_slider': 'onCommentClick',
    },

    init: function () {
        this.state = {
            data: [],
            intervalTime: 6000,
        }
        this._super.apply(this, arguments);
    },
    /**
     * @override
     */
    start() {
        let self = this;
        // todo: This way the conditional view of the snippet is not working.
        this.current = 0;
        this.slideInterval;
        this.slides = []
        this.viewerList = this.el.querySelector('.comments_text_viewer_list')
        this.viewerContent = this.el.querySelector('.comments_text_viewer_content')

        this._getComments()
            .then(data => {
                if(data.data){
                    this._loadList(data)
                    console.log('ssss', this.state.data[0])
                    this._onListClick('', this.state.data[0]['id'])
                }
            })

        return this._super(...arguments);

    },

    _onListClick(ev, commentId=0){
        commentId = commentId ? commentId : ev.target.id;
        let selectedComment = this.state.data.filter(r => r.id == commentId)[0]
        console.log('click', selectedComment, )
        this.viewerContent.innerHTML = `
                        <div  class=" m-4 h3 text-center ">${selectedComment['title']}</div>
                        <div  class=" mb-2 ">${selectedComment['content']}</div>

        `
    },
    _loadList(data){
        let comment_line = ''
        let comment_lines = ''
        this.state.data.forEach(comment => {
            comment_lines += `
                <div id="${comment['id']}" class="comment_view_list_item  btn btn-link ">${comment['title']}</div></br>
            `
            });
        this.viewerList.innerHTML = comment_lines
    },

    async _getComments(){
        // todo: It can be replaced by route rpc. Check how to tack effect of conditional view on snippet options.
        let comments = await rpc('/sd_snippets/snippet/comments')
        comments = JSON.parse(JSON.stringify(comments))
        comments = JSON.parse(comments)
        console.log(comments)
        this.state.data = comments['data']
        this.state.intervalTime = comments['intervalTime']
        console.log('this.state', this.state)

        return comments
    },
});

export default publicWidget.registry.SdComments;
