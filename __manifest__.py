# -*- coding: utf-8 -*-
{
    'name': "SD Snippets",

    'summary': """
    
        """,

    'description': """
        It added some customised snippets to website editor
    """,

    'author': "Arash Homayounfar",
    'website': "https://github.com/gilaneh/hr_extend_ipac",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/14.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Service Desk/Service Desk',
    'application': False,
    'version': '17.0.0.0',

    # any module necessary for this one to work correctly
    'depends': ['website','web_editor', 'hr'],
    'external_dependencies': {
        'python' : ['pandas',],
    },
    # always loaded
    'data': [
        'security/ir.model.access.csv',

        'views/views.xml',
        'views/snippets/birth_days.xml',
        'views/snippets/comments.xml',
        'views/snippets/snippets.xml',

    ],
    'assets': {
        'web.assets_frontend':[
            'sd_snippets/static/src/snippets/**/*.js'
        ],
        'web.report_assets_common': [
            # 'hr_extend_ipac/static/src/css/report_styles.css',
            ],
    },
    'license': 'LGPL-3',

}
