# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


# #################################################################################################
class SdSnippetsSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    limit_comments = fields.Integer(config_parameter='sd_snippets.limit_comments', default=5)
    slide_timer = fields.Float(config_parameter='sd_snippets.slide_timer', default=5)

