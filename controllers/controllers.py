# -*- coding: utf-8 -*-

import odoo

from odoo import http, models, fields, _
from odoo.http import request, SessionExpiredException


from odoo.addons.portal.controllers.web import Home



class Website(Home):
    @http.route('/sd_snippets/snippet/birthdays', type='json', auth='public', website=True)
    def get_employees_birthdays(self, model_name=None, search_domain=None):
        # domain = request.website.website_domain()
        return request.env['hr.employee'].sudo().get_birth_dates()

    @http.route('/sd_snippets/snippet/comments', type='json', auth='user', website=True)
    def get_updates(self, model_name=None, search_domain=None):
        # domain = request.website.website_domain()
        return request.env['sd_snippets.comments'].sudo().get_updates()
