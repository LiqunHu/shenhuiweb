module.exports = {
    INITPASSWORD: '123456',
    REDISKEY: {
        AUTH: 'REDISKEYAUTH',
        SMS: 'REDISKEYSMS'
    },
    MTYPE_ROOT: '00',
    MTYPE_LEAF: '01',
    MTYPEINFO: [{
            'id': '00',
            'value': '00',
            'text': '目录'
        },
        {
            'id': '01',
            'value': '01',
            'text': '菜单'
        }
    ],
    NODETYPEINFO: [{
            'id': '00',
            'text': '根'
        },
        {
            'id': '01',
            'text': '叶子'
        }
    ],
    DOMAIN_ADMINISTRATOR: '0',
    TYPE_DEFAULT: '00', 
    TYPE_ADMINISTRATOR: '01',
    TYPE_OPERATOR: '02',
    AUTH: '1',
    NOAUTH: '0',
    AUTHINFO: [{
            'id': '1',
            'value': '1',
            'text': '需要授权'
        },
        {
            'id': '0',
            'value': '0',
            'text': '无需授权'
        }
    ],
    ENABLE: '1',
    DISABLE: '0',
    STATUSINFO: [{
            'id': '1',
            'value': '1',
            'text': '有效'
        },
        {
            'id': '0',
            'value': '0',
            'text': '无效'
        }
    ],
    TRUE: '1',
    FALSE: '0',
    TFINFO: [{
            'id': '1',
            'value': '1',
            'text': '是'
        },
        {
            'id': '0',
            'value': '0',
            'text': '否'
        }
    ]
};
