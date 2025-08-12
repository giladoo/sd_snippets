/** @odoo-module **/

import { session } from "@web/session";
import publicWidget from "@web/legacy/js/public/public_widget";
import { rpc } from "@web/core/network/rpc";

publicWidget.registry.SdComments = publicWidget.Widget.extend({
    selector: '.sd_snippets_comments',
    init: function () {
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
        this.intervalTime = 8000;
        this.slides = []
//        this.el.querySelector('.comment_data').innerHTML = '';
        this._getComments()
            .then(data => {
                data = JSON.parse(data)
                if(data.data){
                    this._loadComments(data)
                    this.el.querySelector('.comment_header').classList.remove('d-none')
                    this.el.querySelector('.comment_data').classList.remove('d-none')

                } else{
//                    this.el.classList.remove('pt40')
//                    this.el.classList.remove('pb40')
                }
            })
            .then(() => {
//                    this.slides = self.el.querySelectorAll('.slide')
//                    this.slider = document.getElementById("text-slider")
//                    this.showSlide(this.current);
//                    this.slider.addEventListener("mouseleave", () => this.startAutoSlide());
//                    this.slider.addEventListener("mouseenter", () => this.stopAutoSlide());
//                    this.startAutoSlide()
            })




        return this._super(...arguments);

    },

    nextSlide() {
    console.log('slides:', this)
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
        comments['data'].forEach(comment => {
        comment_line = `
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
        comment_lines += comment_line

        })
        this.el.querySelector('.comment_data').innerHTML = `
        <div class="bg-white">
            ${comment_lines}
        </div>
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
