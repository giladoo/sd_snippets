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
import pandas as pd

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
        # ic(data)
        month = int(data['birthday'].month)
        day = int(data['birthday'].day)
        if data.get('avatar_256', False) and len(data.get('avatar_256', [])) > 500:
            data['avatar'] = f"/sd_snippets/snippet/image/{data['id']}/"
        else:
            data['avatar'] = "/base/static/img/avatar.png"

        if data.get('avatar_256', False):
            # ic(data['id'], len(data.get('avatar_256', [])), len(data.get('avatar_256', [])) > 500)
            del data['avatar_256']
        # ic(len(data.get('avatar_256', [])) > 500, data)
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

    def get_birth_dates_1(self, the_day=datetime.now(), short_range=10, long_range=40, ):
        lang = self.env.context.get('lang', 'en_US')
        the_day = datetime.now(pytz.timezone(self.env.context.get('tz', 'Asia/Tehran')))
        # the_day = datetime(2025, 3, 23)
        employees = self.sudo().search_read([('birthday', '!=', False)],['name', 'birthday', 'avatar_128', 'work_location_id'], order='birthday desc')
        employees_pd = pd.DataFrame(employees)
        # print('\n.............\n', employees_pd)
        data = self.birth_day_range(employees, the_day, lang, short_range)
        this_month = self.birth_day_range(employees, the_day, lang, long_range)

        return json.dumps({'data': data, 'this_month': this_month})

    def get_birth_dates(self, the_day=datetime.now(), short_range=10, long_range=40,):
        lang = self.env.context.get('lang', 'en_US')
        today = datetime.now(pytz.timezone(self.env.context.get('tz', 'Asia/Tehran'))).date()
        # today = datetime.now().date()
        # today = date(2025, 8, 18)
        start_day = today - timedelta(days=7)
        end_day = today + timedelta(days=7)

        emp_fields = ['name', 'birthday', 'avatar_128', 'work_location_id']
        # employees = odoo.env['hr.employee'].search_read([], emp_fields)
        employees = self.sudo().search_read([('birthday', '!=', False)],emp_fields, order='birthday desc')

        df = pd.DataFrame(employees)
        df['av'] = df['avatar_128'].str.len()
        df['avatar'] = df.apply(lambda row: f"/sd_snippets/snippet/image/{row['id']}" if int(
            row['av']) > 500 else "/base/static/img/avatar.png", axis=1)
        df.drop('avatar_128', axis=1, inplace=True)
        df = df[df['birthday'] != False]
        df['birthday'] = pd.to_datetime(df['birthday'])


        def date_sort(x):
            if x.month < start_day.month:
                res = x.replace(year=today.year + 1)
            else:
                res = x.replace(year=today.year)
            return res

        df['birthday1'] = df['birthday'].apply(lambda x: date_sort(x))
        df.sort_values('birthday1', inplace=True)
        df['birthday1'] = pd.to_datetime(df['birthday1'])
        start_day = pd.to_datetime(start_day)
        end_day = pd.to_datetime(end_day)
        jdatetime.set_locale(jdatetime.FA_LOCALE)
        df1 = df[df['birthday1'] > start_day]
        df2 = df1[df1['birthday1'] < end_day]
        df2['month'] = df2['birthday1'].apply(lambda x: jdatejs(x, "%B"))
        df2['day'] = df2['birthday1'].apply(lambda x: jdatejs(x, "%d"))
        df2 = df2.reset_index()
        data =  json.loads(df2.to_json(orient='records'))
        return json.dumps({'data': data, 'this_month': data})