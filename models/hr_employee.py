# -*- coding: utf-8 -*-
import json

from odoo import models, fields, api, Command
# from colorama import Fore
import os, fnmatch
import base64
import pandas as pd
import jdatetime
from datetime import date, datetime, timedelta
import pytz

# #######################################################################################
class SdSnippetsBirthDays(models.Model):
    _inherit = 'hr.employee'

    months = [('01', 'فروردین'), ('02', 'اردیبهشت'), ('03', 'خرداد'), ('04', 'تیر'),
                              ('05', 'مرداد'), ('06', 'شهریور'), ('07', 'مهر'), ('08', 'آبان'),
                              ('09', 'آذر'), ('10', 'دی'), ('11', 'بهمن'), ('12', 'اسفند'), ]
    def get_birth_dates(self):
        context = self.env.context
        month_day = []
        today = datetime.now(pytz.timezone(context.get('tz', 'Asia/Tehran')))
        days = list([today + timedelta(days=rec - 1) for rec in range(4)])
        month_day = list([(rec.month, rec.day) for rec in days])
        records = self.sudo().search([('birthday', '!=', False)], order='birthday desc')

        data = list([{'id': rec.id,
                      'name': rec.name,
                      'month': self.birthdate_converter(rec.birthday, context.get('lang', 'en_US'))['month'],
                      'day': self.birthdate_converter(rec.birthday, context.get('lang', 'en_US'))['day'],
                      'birthday': self.birthdate_converter(rec.birthday, context.get('lang', 'en_US'))['date'],
                      } for rec in records if rec.birthday and (rec.birthday.month, rec.birthday.day) in month_day
                     ])
        data = sorted(data, key=lambda x: (x['month'], x['day'],))

        return json.dumps({'data': data})


    def birthdate_converter(self, date_time, lang):
        if lang == 'fa_IR':
            date_time = jdatetime.datetime.fromgregorian(datetime=date_time)
            month_name = [rec for rec in self.months if rec[0] == date_time.strftime("%m")][0]
            date_time = {'date': f'{month_name[1]} {date_time.strftime("%d")}',
                         'month': date_time.month,
                         'day': date_time.day,
                         }
        else:
            date_time = {'date': date_time.strftime("%M %d"),
                         'month': date_time.month,
                         'day': date_time.day,
                         }
        return date_time
