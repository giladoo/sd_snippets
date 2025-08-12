# -*- coding: utf-8 -*-

import odoo

from odoo import http, models, fields, _
from odoo.http import request, SessionExpiredException
from icecream import ic

from odoo.addons.portal.controllers.web import Home
from werkzeug.wrappers import Response

import base64

class Website(Home):
    @http.route('/sd_snippets/snippet/birthdays', type='json', auth='public', website=True)
    def get_employees_birthdays(self, model_name=None, search_domain=None):
        # domain = request.website.website_domain()
        # request.env['hr.employee'].sudo().get_birth_dates_new()
        return request.env['hr.employee'].sudo().get_birth_dates()

    @http.route('/sd_snippets/snippet/comments/', type='json', auth='user', website=True)
    def get_updates(self, model_name=None, search_domain=None, ):
        # domain = request.website.website_domain()
        # TODO: limit_comments can be set in comments settings
        return request.env['sd_snippets.comments'].sudo().get_comments_updates()

    @http.route('/sd_snippets/snippet/image/<int:employee_id>', type='http', auth='public', website=True)
    def get_employee_avatar(self, employee_id, **kw):
        employee = request.env['hr.employee'].sudo().search([('id', '=', employee_id)])
        avatar_128 = employee.avatar_128
        # ic(employee, len(employee.image_256))
        if len(avatar_128) < 500:
            ic(employee, avatar_128)



        #     placeholder_path = request.env['ir.module.module']._get_static_file_path('sd_contacts',
        #                                                                              'img/im.jpg')  # Get the absolute path
        #     # ic(placeholder_path)
        #     if placeholder_path:
        #         with open(placeholder_path, 'rb') as f:  # Open in binary mode
        #             image_data = f.read()
        #         return Response(image_data, content_type='image/jpeg')

        # For employee avatars, use direct_passthrough and Content-Length
        content_type = 'image/png'  # Or image/jpeg, etc. (check your avatars)
        headers = [('Content-Type',
                    content_type)]  # , ('Content-Length', len(employee.avatar_128))]  # Content-Length is optional if you have decoding issues
        return Response(base64.b64decode(avatar_128), headers=headers, direct_passthrough=True)
