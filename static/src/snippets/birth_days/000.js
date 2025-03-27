/** @odoo-module **/
import { session } from "@web/session";
import publicWidget from "@web/legacy/js/public/public_widget";
import { rpc } from "@web/core/network/rpc";

publicWidget.registry.SdBirthDays = publicWidget.Widget.extend({
    selector: '.sd_snippets_birth_days',
    init: function () {
        this._super.apply(this, arguments);
//        this.rpc = this.bindService("rpc");
    },
//    willStart(){
//        const _super = this._super.bind(this);
//
//            console.log('birthday onWillStart:', session)
//            if(session.user_id == false){
//            console.log('birthday onWillStart:', this)
//                this.el.innerHTML = ''
//            }
//
//        return _super(...arguments)
//    },
    /**
     * @override
     */
    start() {
//        console.log('sd_snippets_birth_days', this.el, this.el.querySelector('.s_allow_columns'))
        // todo: This way the conditional view of the snippet is not working.
        //  I need to change it based on conditional view.
        //  I there is no user_id check, the browser will show an warning of session.
//        console.log('birthday snippet:', this)
//        if (session.user_id == false) return
//        this.el.querySelector('.s_allow_columns') && this.el.querySelector('.s_allow_columns').innerHTML = '';
        this._getData()
            .then(data => {
                if(data.data && data.data.length){
                    this._loadData(data)
                    this.el.querySelector('.birthday_header').classList.remove('d-none')
                    this.el.querySelector('.s_allow_columns').classList.remove('d-none')
                } else{
//                    this.el.classList.remove('pt40')
//                    this.el.classList.remove('pb40')
                }
            });

        return this._super(...arguments);

    },
    _loadData(data){
//        console.log('sd_snippets_birth_days load:', data, )
//               this.el.querySelector('.s_allow_columnss_allow_columns').innerHTML = '';
        let data_lines = '';
        let this_month_lines = ['', ''];
        let birthDayEl = this.el.querySelector('.birthday_data');
        console.log('birthDayThisMonth', this)
        let birthDayThisMonth = this.el.querySelector('.birthday_this_month');
        console.log('birthDayThisMonth', birthDayEl, birthDayThisMonth)
        birthDayEl.innerHTML = ''
        birthDayThisMonth.innerHTML = ''

        data['data'].forEach(data_rec => {
//                src="/employee/image?model=hr.employee.public&amp;id=${data_rec['id']}&amp;field=avatar_128"
        data_lines += `
            <div class="card text-center mx-auto my-2 py-3 shadow" style="width:150px">
                <img class="card-img-top"
                src="/website/image/hr.employee/${data_rec['id']}/avatar_256"
                style="height: 120px;"
                alt="Card image">
                <div class="card-body">
                  <h5 class="card-title">${data_rec['name']}</h4>
                  <p class="card-text"> ${data_rec['month']}  ${data_rec['day']}</p>
                </div>
            </div>
        `;

        })
        const this_month_len = data['this_month'].length;
        data['this_month'].forEach((data_rec, index) => {
            this_month_lines[index < this_month_len / 2 ? 0 : 1 ] += `
                <div class="col row row-cols-auto smaller border-bottom1 my-1">
                    <div class="col" style="min-width: 50px;">${data_rec.day}</div>
                    <div class="col" style="min-width: 100px;">${data_rec.month}</div>
                    <div class="col">${data_rec.name}</div>
                </div>
            `;
        })

        birthDayEl.innerHTML = `
        <div class="row container mx-auto">
            ${data_lines}
        </div>
        `;
        birthDayThisMonth.innerHTML = `
        <div class=" container mx-auto">
            <div class="row mx-2">
                <div class="col-12 col-md-6 ps-2 ">
                    ${this_month_lines[0]}
                </div>
                <div class="col-12 col-md-6 ps-2 ps-md-5">
                    ${this_month_lines[1]}
                </div>
            </div>
        </div>
        `;

    },
    async _getData(){
        // todo: It can be replaced by route rpc. Check how to tack effect of conditional view on snippet options.
        let birthdays = await rpc('/sd_snippets/snippet/birthdays')
        birthdays = JSON.parse(birthdays)
        console.log('birthdays:', birthdays)
        return birthdays

    },
});

export default publicWidget.registry.SdBirthDays;
