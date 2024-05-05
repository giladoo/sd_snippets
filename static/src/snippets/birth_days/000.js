/** @odoo-module **/

import publicWidget from 'web.public.widget';
import session from 'web.session';

publicWidget.registry.SdBirthDays = publicWidget.Widget.extend({
    selector: '.sd_snippets_birth_days',

    /**
     * @override
     */
    start() {
        console.log('sd_snippets_birth_days', this.el, this.el.querySelector('.s_allow_columns'))
        // todo: This way the conditional view of the snippet is not working.
        //  I need to change it based on conditional view.
        //  I there is no user_id check, the browser will show an warning of session.
                this.el.querySelector('.s_allow_columns').innerHTML = '';

        if(session.user_id){
                console.log('sd_snippets_birth_days', session.user_id)
//                this.el.querySelector('.s_allow_columns').innerHTML = 'Birth';

            this._getData()
                .then(data => data ? this._loadData(data) : '');

        }else{
                console.log('sd_snippets_birth_days else', session.user_id)
        this.el.classList.remove('pt40')
        this.el.classList.remove('pb40')
        }
        return this._super(...arguments);

    },
    _loadData(data){
//        console.log('sd_snippets_birth_days load:', data, )
//               this.el.querySelector('.s_allow_columns').innerHTML = '';
        let data_lines = ''
        data['data'].forEach(data_rec => {
        data_lines += `
        <div class="col bg-warning-light rounded-circle py-3 mx-1 text-center">
            <div class="img_div rounded  mx-auto my-2 p-1 "
                style="background-image: url(/employee/image?model=hr.employee.public&amp;id=${data_rec['id']}&amp;field=avatar_128)"></div>
            <div class="h6 mb-2">
                ${data_rec['name']}
            </div>
            <div class="">
                ${data_rec['birthday']}
            </div>
        </div>
        `
        })
        this.el.querySelector('.s_allow_columns').innerHTML = `
        <div class="row">
            ${data_lines}
        </div>
        `;

    },
    async _getData(){
        // todo: It can be replaced by route rpc. Check how to tack effect of conditional view on snippet options.
        return this._rpc({
            model: "hr.employee",
            method: "get_birth_dates",
            args: [[]],
        })
        .then(data => JSON.parse(data))
        .then(data => data)
        .catch(er => false);
    },
});

export default publicWidget.registry.SdBirthDays;
