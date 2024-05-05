# -*- coding: utf-8 -*-
import json

from odoo import models, fields, api, Command
from colorama import Fore
import os, fnmatch
import base64
import pandas as pd
import jdatetime
from datetime import date, datetime
import pytz

# #######################################################################################
class SdSnippetsComments(models.Model):
    _name = 'sd_snippets.comments'
    _description = 'sd_snippets.comments'
    _rec_name = 'title'
    _order = 'rec_date desc'

    rec_date = fields.Date(required=True, default=lambda self: datetime.now(pytz.timezone(self.env.context.get('tz', 'Asia/Tehran'))))
    title = fields.Char(required=True)
    content = fields.Html(required=True)
    published = fields.Boolean(default=False)
    # website = fields.Many2one('')

    def get_updates(self):
        records = self.search([('rec_date', '<=', date.today()), ('published', '=', True)],
                              order='rec_date desc', limit=3)
        data = list([{'title': rec.title,
                      'date': rec.rec_date.strftime('%Y/%m/%d'),
                      'content': rec.content,
                      } for rec in records])
        return json.dumps({'data': data})

    def toggle_publish(self):
        for rec in self:
            rec.published = False if rec.published else True
