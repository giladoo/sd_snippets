/** @odoo-module **/

import { session } from "@web/session";
import publicWidget from "@web/legacy/js/public/public_widget";
import { rpc } from "@web/core/network/rpc";

publicWidget.registry.SdComments = publicWidget.Widget.extend({
    selector: '.sd_snippets_comments_slides',
        events: {
        'click .comment_selector_keys': 'onCommentSelectorClick',
        'click .comments_text_slider': 'onCommentClick',
    },

    init: function () {
        this.state = {
            data: [],
        }
        this._super.apply(this, arguments);
    },
    /**
     * @override
     */
    start() {
        let self = this;
//        console.log('sd_snippets_comments', this.el, this.el.querySelector('.s_allow_columns'))
        // todo: This way the conditional view of the snippet is not working.
        //  I need to change it based on conditional view.
        //  I there is no user_id check, the browser will show an warning of session.
        this.current = 0;
        this.slideInterval;
        this.intervalTime = 6000;
        this.slides = []
//        this.el.querySelector('.comment_data').innerHTML = '';
        this._getComments()
            .then(data => {
                data = JSON.parse(data)
                this.state.data = data
                if(data.data){
                    this._loadComments(data)
//                    this.el.querySelector('.comment_header').classList.remove('d-none')
//                    this.el.querySelector('.comment_data').classList.remove('d-none')

                } else{
//                    this.el.classList.remove('pt40')
//                    this.el.classList.remove('pb40')
                }
            })
            .then(() => {
                    this.slides = this.el.querySelectorAll('.slide')
                    this.slider = this.el.querySelector(".comments_text_slider_container")
                    this.showSlide(this.current);
                    this.slider.addEventListener("mouseleave", () => this.startAutoSlide());
                    this.slider.addEventListener("mouseenter", () => this.stopAutoSlide());
                    this.startAutoSlide()
            })


        console.log('this.state:', this.state)

        return this._super(...arguments);

    },
    onCommentSelectorClick(ev){
        if (ev.target.classList.contains('fa-caret-up')){
            this.nextSlide()
        } else if (ev.target.classList.contains('fa-caret-down')){
            this.prevSlide()
        }
        },
    onCommentClick(ev){
        console.log('click', ev)

    },
    nextSlide() {
        this.slides = document.querySelectorAll('.slide')
        this.current = (this.current + 1) % this.slides.length;
        this.showSlide(this.current);
    },

    prevSlide() {
        this.current = (this.current - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.current);
    },
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
            }
        });
    },
    startAutoSlide() {
        this.slideInterval = setInterval(() => this.nextSlide(), this.intervalTime);
    },

    stopAutoSlide() {
        clearInterval(this.slideInterval);
    },

    _loadComments(comments){
//        console.log('_loadComments:', comments, )
//               this.el.querySelector('.s_allow_columns').innerHTML = '';
        let comment_line = ''
        let comment_lines = ''
        let comment_slider = ''
//        comments['data'].forEach(comment => {
        console.log('data', this.state.data)
        this.state.data.data.forEach(comment => {
            comment_line = `
            <div class="bg-white">
                <div class="  p-0 p-md-0 my-2 ">
                    <div class="h5 mx-2 mt-1">
                        ${comment['title']}
                    </div>
                </div>
            </div>
            `
            comment_slider += `
                <div id="${comment['id']}" class="slide">${comment_line}</div>
            `
            })

        this.el.querySelector('.comments_text_slider').innerHTML = `
            ${comment_slider}
        `;



    },
    async _getComments(){
        // todo: It can be replaced by route rpc. Check how to tack effect of conditional view on snippet options.
        let comments = await rpc('/sd_snippets/snippet/comments')
        comments = JSON.parse(JSON.stringify(comments))
        return comments
    },
});

export default publicWidget.registry.SdComments;
