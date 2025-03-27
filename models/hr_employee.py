# -*- coding: utf-8 -*-
import json

from odoo import models, fields, api, Command
# from colorama import Fore
import os, fnmatch
import base64
import pandas as pd
import jdatetime
from jdatetimext import j_start_end, jdatejs
from datetime import date, datetime, timedelta
import pytz
from icecream import ic

# #######################################################################################
class SdSnippetsBirthDays(models.Model):
    _inherit = 'hr.employee'

    months = [('01', 'فروردین'), ('02', 'اردیبهشت'), ('03', 'خرداد'), ('04', 'تیر'),
                              ('05', 'مرداد'), ('06', 'شهریور'), ('07', 'مهر'), ('08', 'آبان'),
                              ('09', 'آذر'), ('10', 'دی'), ('11', 'بهمن'), ('12', 'اسفند'), ]

    def get_month_name_in_persian(self, month):
        months = [
            "فروردین", "اردیبهشت", "خرداد", "تیر",
            "مرداد", "شهریور", "مهر", "آبان",
            "آذر", "دی", "بهمن", "اسفند"
        ]
        return months[month - 1]

    def find_it(self, data, rec, lang):
        month = int(data['birthday'].month)
        day = int(data['birthday'].day)

        res = data.copy() if int(rec[1]) == month and int(rec[2]) == day else False
        if res and lang == 'fa_IR':
            res['month'] = self.get_month_name_in_persian(int(jdatejs(res['birthday'], "%m")))
            res['day'] = jdatejs(res['birthday'], "%d")
            # birthday must be updated on the last
            res['birthday'] = jdatejs(res['birthday'], "%Y/%m/%d")

        elif res:
            res['month'] = res['birthday'].strftime("%B")
            res['day'] = res['birthday'].strftime("%d")
            res['birthday'] = res['birthday'].strftime("%Y-%m-%d")

        return res

    def birth_day_range(self, employees, the_day=datetime.now(), lang='en_US', date_range=10):
        date_range = date_range // 2
        first_day = the_day - timedelta(days=date_range)
        last_day = the_day + timedelta(days=date_range)
        days = [first_day + timedelta(days=r) for r in range(2 * date_range + 1)]
        range_of_days = list([(rec.year, rec.month, rec.day) for rec in days])
        find_in_range_of_days = [self.find_it(data, rec, lang) for rec in range_of_days for data in employees]
        return list([rec for rec in find_in_range_of_days if rec])

    def get_birth_dates(self, the_day=datetime.now(), short_range=10, long_range=40, ):
        lang = self.env.context.get('lang', 'en_US')
        the_day = datetime.now(pytz.timezone(self.env.context.get('tz', 'Asia/Tehran')))
        # the_day = datetime(2025, 3, 23)
        employees = self.sudo().search_read([('birthday', '!=', False)],['name', 'birthday'], order='birthday desc')

        data = self.birth_day_range(employees, the_day, lang, short_range)
        this_month = self.birth_day_range(employees, the_day, lang, long_range)

        return json.dumps({'data': data, 'this_month': this_month})

