"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = exports.userOperations = void 0;
exports.userOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['user'],
            },
        },
        options: [
            {
                name: 'Get Current User',
                value: 'get',
                description: 'Get details about the current user',
                action: 'Get current user',
            },
            {
                name: 'Get Summary',
                value: 'getSummary',
                description: 'Get a summary of the user account',
                action: 'Get account summary',
            },
            {
                name: 'Get Account Settings',
                value: 'getAccountSettings',
                description: 'Get account settings',
                action: 'Get account settings',
            },
            {
                name: 'Update Account Settings',
                value: 'updateAccountSettings',
                description: 'Update account settings',
                action: 'Update account settings',
            },
            {
                name: 'Get User Settings',
                value: 'getUserSettings',
                description: 'Get user settings',
                action: 'Get user settings',
            },
            {
                name: 'Update User Settings',
                value: 'updateUserSettings',
                description: 'Update user settings',
                action: 'Update user settings',
            },
            {
                name: 'Get User Account Settings',
                value: 'getUserAccountSettings',
                description: 'Get user account settings',
                action: 'Get user account settings',
            },
            {
                name: 'Update User Account Settings',
                value: 'updateUserAccountSettings',
                description: 'Update user account settings',
                action: 'Update user account settings',
            },
        ],
        default: 'get',
    },
];
exports.userFields = [
    {
        "displayName": "Start Date",
        "name": "start_date",
        "type": "string",
        "default": "",
        "description": "Start of date range in ISO 8601 date format (YYYY-MM-DD)",
        "displayOptions": {
            "show": {
                "resource": [
                    "user"
                ],
                "operation": [
                    "getSummary"
                ]
            }
        },
        "required": true,
        "placeholder": "2024-01-01"
    },
    {
        "displayName": "End Date",
        "name": "end_date",
        "type": "string",
        "default": "",
        "description": "End of date range in ISO 8601 date format (YYYY-MM-DD)",
        "displayOptions": {
            "show": {
                "resource": [
                    "user"
                ],
                "operation": [
                    "getSummary"
                ]
            }
        },
        "required": true,
        "placeholder": "2024-01-31"
    },
    {
        "displayName": "Additional Fields",
        "name": "additionalFields",
        "type": "collection",
        "placeholder": "Add Field",
        "default": {},
        "displayOptions": {
            "show": {
                "resource": [
                    "user"
                ],
                "operation": [
                    "getSummary"
                ]
            }
        },
        "options": [
            {
                "displayName": "Include Excluded From Budget",
                "name": "include_exclude_from_budgets",
                "type": "boolean",
                "default": false,
                "description": "Include categories that have the \"Exclude from Budgets\" flag set"
            },
            {
                "displayName": "Include Occurrences",
                "name": "include_occurrences",
                "type": "boolean",
                "default": false,
                "description": "Include an occurrences array for each category showing activity per budget period"
            },
            {
                "displayName": "Include Past Budget Dates",
                "name": "include_past_budget_dates",
                "type": "boolean",
                "default": false,
                "description": "Include three budget occurrences prior to the start date (requires Include Occurrences)"
            },
            {
                "displayName": "Include Totals",
                "name": "include_totals",
                "type": "boolean",
                "default": false,
                "description": "Include a top-level totals section summarising inflow and outflow"
            },
            {
                "displayName": "Include Rollover Pool",
                "name": "include_rollover_pool",
                "type": "boolean",
                "default": false,
                "description": "Include a rollover_pool section summarising the current rollover pool balance and previous adjustments"
            }
        ]
    },
    {
        "displayName": "Additional Fields",
        "name": "additionalFields",
        "type": "collection",
        "placeholder": "Add Field",
        "default": {},
        "displayOptions": {
            "show": {
                "resource": [
                    "user"
                ],
                "operation": [
                    "updateAccountSettings"
                ]
            }
        },
        "options": [
            {
                "displayName": "Primary Currency",
                "name": "primary_currency",
                "type": "options",
                "default": "",
                "description": "If set, updates the account's primary currency.",
                "options": [
                    {
                        "name": "Aed",
                        "value": "aed"
                    },
                    {
                        "name": "Afn",
                        "value": "afn"
                    },
                    {
                        "name": "All",
                        "value": "all"
                    },
                    {
                        "name": "Amd",
                        "value": "amd"
                    },
                    {
                        "name": "Ang",
                        "value": "ang"
                    },
                    {
                        "name": "Aoa",
                        "value": "aoa"
                    },
                    {
                        "name": "Ars",
                        "value": "ars"
                    },
                    {
                        "name": "Aud",
                        "value": "aud"
                    },
                    {
                        "name": "Awg",
                        "value": "awg"
                    },
                    {
                        "name": "Azn",
                        "value": "azn"
                    },
                    {
                        "name": "Bam",
                        "value": "bam"
                    },
                    {
                        "name": "Bbd",
                        "value": "bbd"
                    },
                    {
                        "name": "Bdt",
                        "value": "bdt"
                    },
                    {
                        "name": "Bgn",
                        "value": "bgn"
                    },
                    {
                        "name": "Bhd",
                        "value": "bhd"
                    },
                    {
                        "name": "Bif",
                        "value": "bif"
                    },
                    {
                        "name": "Bmd",
                        "value": "bmd"
                    },
                    {
                        "name": "Bnd",
                        "value": "bnd"
                    },
                    {
                        "name": "Bob",
                        "value": "bob"
                    },
                    {
                        "name": "Brl",
                        "value": "brl"
                    },
                    {
                        "name": "Bsd",
                        "value": "bsd"
                    },
                    {
                        "name": "Btc",
                        "value": "btc"
                    },
                    {
                        "name": "Btn",
                        "value": "btn"
                    },
                    {
                        "name": "Bwp",
                        "value": "bwp"
                    },
                    {
                        "name": "Byn",
                        "value": "byn"
                    },
                    {
                        "name": "Bzd",
                        "value": "bzd"
                    },
                    {
                        "name": "Cad",
                        "value": "cad"
                    },
                    {
                        "name": "Cdf",
                        "value": "cdf"
                    },
                    {
                        "name": "Chf",
                        "value": "chf"
                    },
                    {
                        "name": "Clf",
                        "value": "clf"
                    },
                    {
                        "name": "Clp",
                        "value": "clp"
                    },
                    {
                        "name": "Cny",
                        "value": "cny"
                    },
                    {
                        "name": "Cop",
                        "value": "cop"
                    },
                    {
                        "name": "Crc",
                        "value": "crc"
                    },
                    {
                        "name": "Cuc",
                        "value": "cuc"
                    },
                    {
                        "name": "Cup",
                        "value": "cup"
                    },
                    {
                        "name": "Cve",
                        "value": "cve"
                    },
                    {
                        "name": "Czk",
                        "value": "czk"
                    },
                    {
                        "name": "Djf",
                        "value": "djf"
                    },
                    {
                        "name": "Dkk",
                        "value": "dkk"
                    },
                    {
                        "name": "Dop",
                        "value": "dop"
                    },
                    {
                        "name": "Dzd",
                        "value": "dzd"
                    },
                    {
                        "name": "Egp",
                        "value": "egp"
                    },
                    {
                        "name": "Ern",
                        "value": "ern"
                    },
                    {
                        "name": "Etb",
                        "value": "etb"
                    },
                    {
                        "name": "Eth",
                        "value": "eth"
                    },
                    {
                        "name": "Eur",
                        "value": "eur"
                    },
                    {
                        "name": "Fjd",
                        "value": "fjd"
                    },
                    {
                        "name": "Fkp",
                        "value": "fkp"
                    },
                    {
                        "name": "Gbp",
                        "value": "gbp"
                    },
                    {
                        "name": "Gel",
                        "value": "gel"
                    },
                    {
                        "name": "Ggp",
                        "value": "ggp"
                    },
                    {
                        "name": "Ghs",
                        "value": "ghs"
                    },
                    {
                        "name": "Gip",
                        "value": "gip"
                    },
                    {
                        "name": "Gmd",
                        "value": "gmd"
                    },
                    {
                        "name": "Gnf",
                        "value": "gnf"
                    },
                    {
                        "name": "Gtq",
                        "value": "gtq"
                    },
                    {
                        "name": "Gyd",
                        "value": "gyd"
                    },
                    {
                        "name": "Hkd",
                        "value": "hkd"
                    },
                    {
                        "name": "Hnl",
                        "value": "hnl"
                    },
                    {
                        "name": "Hrk",
                        "value": "hrk"
                    },
                    {
                        "name": "Htg",
                        "value": "htg"
                    },
                    {
                        "name": "Huf",
                        "value": "huf"
                    },
                    {
                        "name": "Idr",
                        "value": "idr"
                    },
                    {
                        "name": "Ils",
                        "value": "ils"
                    },
                    {
                        "name": "Imp",
                        "value": "imp"
                    },
                    {
                        "name": "Inr",
                        "value": "inr"
                    },
                    {
                        "name": "Iqd",
                        "value": "iqd"
                    },
                    {
                        "name": "Irr",
                        "value": "irr"
                    },
                    {
                        "name": "Isk",
                        "value": "isk"
                    },
                    {
                        "name": "Jep",
                        "value": "jep"
                    },
                    {
                        "name": "Jmd",
                        "value": "jmd"
                    },
                    {
                        "name": "Jod",
                        "value": "jod"
                    },
                    {
                        "name": "Jpy",
                        "value": "jpy"
                    },
                    {
                        "name": "Kes",
                        "value": "kes"
                    },
                    {
                        "name": "Kgs",
                        "value": "kgs"
                    },
                    {
                        "name": "Khr",
                        "value": "khr"
                    },
                    {
                        "name": "Kmf",
                        "value": "kmf"
                    },
                    {
                        "name": "Kpw",
                        "value": "kpw"
                    },
                    {
                        "name": "Krw",
                        "value": "krw"
                    },
                    {
                        "name": "Kwd",
                        "value": "kwd"
                    },
                    {
                        "name": "Kyd",
                        "value": "kyd"
                    },
                    {
                        "name": "Kzt",
                        "value": "kzt"
                    },
                    {
                        "name": "Lak",
                        "value": "lak"
                    },
                    {
                        "name": "Lbp",
                        "value": "lbp"
                    },
                    {
                        "name": "Lkr",
                        "value": "lkr"
                    },
                    {
                        "name": "Lrd",
                        "value": "lrd"
                    },
                    {
                        "name": "Lsl",
                        "value": "lsl"
                    },
                    {
                        "name": "Ltl",
                        "value": "ltl"
                    },
                    {
                        "name": "Lvl",
                        "value": "lvl"
                    },
                    {
                        "name": "Lyd",
                        "value": "lyd"
                    },
                    {
                        "name": "Mad",
                        "value": "mad"
                    },
                    {
                        "name": "Mdl",
                        "value": "mdl"
                    },
                    {
                        "name": "Mga",
                        "value": "mga"
                    },
                    {
                        "name": "Mkd",
                        "value": "mkd"
                    },
                    {
                        "name": "Mmk",
                        "value": "mmk"
                    },
                    {
                        "name": "Mnt",
                        "value": "mnt"
                    },
                    {
                        "name": "Mop",
                        "value": "mop"
                    },
                    {
                        "name": "Mro",
                        "value": "mro"
                    },
                    {
                        "name": "Mur",
                        "value": "mur"
                    },
                    {
                        "name": "Mvr",
                        "value": "mvr"
                    },
                    {
                        "name": "Mwk",
                        "value": "mwk"
                    },
                    {
                        "name": "Mxn",
                        "value": "mxn"
                    },
                    {
                        "name": "Myr",
                        "value": "myr"
                    },
                    {
                        "name": "Mzn",
                        "value": "mzn"
                    },
                    {
                        "name": "Nad",
                        "value": "nad"
                    },
                    {
                        "name": "Ngn",
                        "value": "ngn"
                    },
                    {
                        "name": "Nio",
                        "value": "nio"
                    },
                    {
                        "name": "Nok",
                        "value": "nok"
                    },
                    {
                        "name": "Npr",
                        "value": "npr"
                    },
                    {
                        "name": "Nzd",
                        "value": "nzd"
                    },
                    {
                        "name": "Omr",
                        "value": "omr"
                    },
                    {
                        "name": "Pab",
                        "value": "pab"
                    },
                    {
                        "name": "Pen",
                        "value": "pen"
                    },
                    {
                        "name": "Pgk",
                        "value": "pgk"
                    },
                    {
                        "name": "Php",
                        "value": "php"
                    },
                    {
                        "name": "Pkr",
                        "value": "pkr"
                    },
                    {
                        "name": "Pln",
                        "value": "pln"
                    },
                    {
                        "name": "Pyg",
                        "value": "pyg"
                    },
                    {
                        "name": "Qar",
                        "value": "qar"
                    },
                    {
                        "name": "Ron",
                        "value": "ron"
                    },
                    {
                        "name": "Rsd",
                        "value": "rsd"
                    },
                    {
                        "name": "Rub",
                        "value": "rub"
                    },
                    {
                        "name": "Rwf",
                        "value": "rwf"
                    },
                    {
                        "name": "Sar",
                        "value": "sar"
                    },
                    {
                        "name": "Sbd",
                        "value": "sbd"
                    },
                    {
                        "name": "Scr",
                        "value": "scr"
                    },
                    {
                        "name": "Sdg",
                        "value": "sdg"
                    },
                    {
                        "name": "Sek",
                        "value": "sek"
                    },
                    {
                        "name": "Sgd",
                        "value": "sgd"
                    },
                    {
                        "name": "Shp",
                        "value": "shp"
                    },
                    {
                        "name": "Sll",
                        "value": "sll"
                    },
                    {
                        "name": "Sos",
                        "value": "sos"
                    },
                    {
                        "name": "Srd",
                        "value": "srd"
                    },
                    {
                        "name": "Std",
                        "value": "std"
                    },
                    {
                        "name": "Svc",
                        "value": "svc"
                    },
                    {
                        "name": "Syp",
                        "value": "syp"
                    },
                    {
                        "name": "Szl",
                        "value": "szl"
                    },
                    {
                        "name": "Thb",
                        "value": "thb"
                    },
                    {
                        "name": "Tjs",
                        "value": "tjs"
                    },
                    {
                        "name": "Tmt",
                        "value": "tmt"
                    },
                    {
                        "name": "Tnd",
                        "value": "tnd"
                    },
                    {
                        "name": "Top",
                        "value": "top"
                    },
                    {
                        "name": "Try",
                        "value": "try"
                    },
                    {
                        "name": "Ttd",
                        "value": "ttd"
                    },
                    {
                        "name": "Twd",
                        "value": "twd"
                    },
                    {
                        "name": "Tzs",
                        "value": "tzs"
                    },
                    {
                        "name": "Uah",
                        "value": "uah"
                    },
                    {
                        "name": "Ugx",
                        "value": "ugx"
                    },
                    {
                        "name": "Usd",
                        "value": "usd"
                    },
                    {
                        "name": "Uyu",
                        "value": "uyu"
                    },
                    {
                        "name": "Uzs",
                        "value": "uzs"
                    },
                    {
                        "name": "Vef",
                        "value": "vef"
                    },
                    {
                        "name": "Ves",
                        "value": "ves"
                    },
                    {
                        "name": "Vnd",
                        "value": "vnd"
                    },
                    {
                        "name": "Vuv",
                        "value": "vuv"
                    },
                    {
                        "name": "Wst",
                        "value": "wst"
                    },
                    {
                        "name": "Xaf",
                        "value": "xaf"
                    },
                    {
                        "name": "Xag",
                        "value": "xag"
                    },
                    {
                        "name": "Xau",
                        "value": "xau"
                    },
                    {
                        "name": "Xcd",
                        "value": "xcd"
                    },
                    {
                        "name": "Xof",
                        "value": "xof"
                    },
                    {
                        "name": "Xpf",
                        "value": "xpf"
                    },
                    {
                        "name": "Yer",
                        "value": "yer"
                    },
                    {
                        "name": "Zar",
                        "value": "zar"
                    },
                    {
                        "name": "Zmw",
                        "value": "zmw"
                    },
                    {
                        "name": "Zwl",
                        "value": "zwl"
                    }
                ]
            },
            {
                "displayName": "Supported Currencies",
                "name": "supported_currencies",
                "type": "json",
                "default": "",
                "description": "If set, replaces the list of supported currencies for the account."
            },
            {
                "displayName": "Display Name",
                "name": "display_name",
                "type": "string",
                "default": "",
                "description": "If set, updates the display name of the budgeting account."
            },
            {
                "displayName": "Locale",
                "name": "locale",
                "type": "options",
                "default": "",
                "description": "If set, updates the locale used for formatting numbers and currency amounts in the Lunch Money app. See [Supported Locales](https://lunchmoney.dev/v2/locales) for accepted values. Date presentation is configured separately through [GET /me/user/settings](#tag/me/GET/me/user/settings) and [PUT /me/user/settings](#tag/me/PUT/me/user/settings).",
                "options": [
                    {
                        "name": "Sq-AL",
                        "value": "sq-AL"
                    },
                    {
                        "name": "Be-BY",
                        "value": "be-BY"
                    },
                    {
                        "name": "Bg-BG",
                        "value": "bg-BG"
                    },
                    {
                        "name": "Ca-ES",
                        "value": "ca-ES"
                    },
                    {
                        "name": "Zh-CN",
                        "value": "zh-CN"
                    },
                    {
                        "name": "Zh-HK",
                        "value": "zh-HK"
                    },
                    {
                        "name": "Zh-TW",
                        "value": "zh-TW"
                    },
                    {
                        "name": "Hr-HR",
                        "value": "hr-HR"
                    },
                    {
                        "name": "Cs-CZ",
                        "value": "cs-CZ"
                    },
                    {
                        "name": "Da-DK",
                        "value": "da-DK"
                    },
                    {
                        "name": "Nl-BE",
                        "value": "nl-BE"
                    },
                    {
                        "name": "Nl-NL",
                        "value": "nl-NL"
                    },
                    {
                        "name": "En-AU",
                        "value": "en-AU"
                    },
                    {
                        "name": "En-CA",
                        "value": "en-CA"
                    },
                    {
                        "name": "En-IN",
                        "value": "en-IN"
                    },
                    {
                        "name": "En-IE",
                        "value": "en-IE"
                    },
                    {
                        "name": "En-MT",
                        "value": "en-MT"
                    },
                    {
                        "name": "En-NZ",
                        "value": "en-NZ"
                    },
                    {
                        "name": "En-PH",
                        "value": "en-PH"
                    },
                    {
                        "name": "En-SG",
                        "value": "en-SG"
                    },
                    {
                        "name": "En-ZA",
                        "value": "en-ZA"
                    },
                    {
                        "name": "En-GB",
                        "value": "en-GB"
                    },
                    {
                        "name": "En-US",
                        "value": "en-US"
                    },
                    {
                        "name": "Et-EE",
                        "value": "et-EE"
                    },
                    {
                        "name": "Fi-FI",
                        "value": "fi-FI"
                    },
                    {
                        "name": "Fr-BE",
                        "value": "fr-BE"
                    },
                    {
                        "name": "Fr-CA",
                        "value": "fr-CA"
                    },
                    {
                        "name": "Fr-FR",
                        "value": "fr-FR"
                    },
                    {
                        "name": "Fr-LU",
                        "value": "fr-LU"
                    },
                    {
                        "name": "Fr-CH",
                        "value": "fr-CH"
                    },
                    {
                        "name": "De-AT",
                        "value": "de-AT"
                    },
                    {
                        "name": "De-DE",
                        "value": "de-DE"
                    },
                    {
                        "name": "De-LU",
                        "value": "de-LU"
                    },
                    {
                        "name": "De-CH",
                        "value": "de-CH"
                    },
                    {
                        "name": "El-CY",
                        "value": "el-CY"
                    },
                    {
                        "name": "El-GR",
                        "value": "el-GR"
                    },
                    {
                        "name": "Iw-IL",
                        "value": "iw-IL"
                    },
                    {
                        "name": "Hi-IN",
                        "value": "hi-IN"
                    },
                    {
                        "name": "Hu-HU",
                        "value": "hu-HU"
                    },
                    {
                        "name": "Is-IS",
                        "value": "is-IS"
                    },
                    {
                        "name": "In-ID",
                        "value": "in-ID"
                    },
                    {
                        "name": "Ga-IE",
                        "value": "ga-IE"
                    },
                    {
                        "name": "It-IT",
                        "value": "it-IT"
                    },
                    {
                        "name": "It-CH",
                        "value": "it-CH"
                    },
                    {
                        "name": "Ja-JP",
                        "value": "ja-JP"
                    },
                    {
                        "name": "Ko-KR",
                        "value": "ko-KR"
                    },
                    {
                        "name": "Lv-LV",
                        "value": "lv-LV"
                    },
                    {
                        "name": "Lt-LT",
                        "value": "lt-LT"
                    },
                    {
                        "name": "Mk-MK",
                        "value": "mk-MK"
                    },
                    {
                        "name": "Ms-MY",
                        "value": "ms-MY"
                    },
                    {
                        "name": "Mt-MT",
                        "value": "mt-MT"
                    },
                    {
                        "name": "No-NO",
                        "value": "no-NO"
                    },
                    {
                        "name": "Pl-PL",
                        "value": "pl-PL"
                    },
                    {
                        "name": "Pt-BR",
                        "value": "pt-BR"
                    },
                    {
                        "name": "Pt-PT",
                        "value": "pt-PT"
                    },
                    {
                        "name": "Ro-RO",
                        "value": "ro-RO"
                    },
                    {
                        "name": "Ru-RU",
                        "value": "ru-RU"
                    },
                    {
                        "name": "Sk-SK",
                        "value": "sk-SK"
                    },
                    {
                        "name": "Sl-SI",
                        "value": "sl-SI"
                    },
                    {
                        "name": "Es-AR",
                        "value": "es-AR"
                    },
                    {
                        "name": "Es-BO",
                        "value": "es-BO"
                    },
                    {
                        "name": "Es-CL",
                        "value": "es-CL"
                    },
                    {
                        "name": "Es-CO",
                        "value": "es-CO"
                    },
                    {
                        "name": "Es-CR",
                        "value": "es-CR"
                    },
                    {
                        "name": "Es-DO",
                        "value": "es-DO"
                    },
                    {
                        "name": "Es-EC",
                        "value": "es-EC"
                    },
                    {
                        "name": "Es-SV",
                        "value": "es-SV"
                    },
                    {
                        "name": "Es-GT",
                        "value": "es-GT"
                    },
                    {
                        "name": "Es-HN",
                        "value": "es-HN"
                    },
                    {
                        "name": "Es-MX",
                        "value": "es-MX"
                    },
                    {
                        "name": "Es-NI",
                        "value": "es-NI"
                    },
                    {
                        "name": "Es-PA",
                        "value": "es-PA"
                    },
                    {
                        "name": "Es-PY",
                        "value": "es-PY"
                    },
                    {
                        "name": "Es-PE",
                        "value": "es-PE"
                    },
                    {
                        "name": "Es-PR",
                        "value": "es-PR"
                    },
                    {
                        "name": "Es-ES",
                        "value": "es-ES"
                    },
                    {
                        "name": "Es-US",
                        "value": "es-US"
                    },
                    {
                        "name": "Es-UY",
                        "value": "es-UY"
                    },
                    {
                        "name": "Es-VE",
                        "value": "es-VE"
                    },
                    {
                        "name": "Sv-SE",
                        "value": "sv-SE"
                    },
                    {
                        "name": "Th-TH",
                        "value": "th-TH"
                    },
                    {
                        "name": "Tr-TR",
                        "value": "tr-TR"
                    },
                    {
                        "name": "Uk-UA",
                        "value": "uk-UA"
                    },
                    {
                        "name": "Vi-VN",
                        "value": "vi-VN"
                    }
                ]
            },
            {
                "displayName": "Auto Create Category Rules",
                "name": "auto_create_category_rules",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether category rules are created automatically."
            },
            {
                "displayName": "Auto Create Suggested Transaction Rules",
                "name": "auto_create_suggested_transaction_rules",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether suggested transaction rules are created automatically."
            },
            {
                "displayName": "Include Pending In Totals",
                "name": "include_pending_in_totals",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether pending transactions are included in account totals."
            }
        ]
    },
    {
        "displayName": "Additional Fields",
        "name": "additionalFields",
        "type": "collection",
        "placeholder": "Add Field",
        "default": {},
        "displayOptions": {
            "show": {
                "resource": [
                    "user"
                ],
                "operation": [
                    "updateUserSettings"
                ]
            }
        },
        "options": [
            {
                "displayName": "Show Debits As Negative",
                "name": "show_debits_as_negative",
                "type": "boolean",
                "default": false,
                "description": "If set, updates the display preference for amount signs in the Lunch Money app. Does not affect amount sign conventions in API responses."
            },
            {
                "displayName": "Auto Suggest Payee",
                "name": "auto_suggest_payee",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether payee suggestions are shown."
            },
            {
                "displayName": "Month Year Format",
                "name": "month_year_format",
                "type": "options",
                "default": "",
                "description": "If set, updates the month and year display format.",
                "options": [
                    {
                        "name": "MMMM YYYY",
                        "value": "MMMM YYYY"
                    },
                    {
                        "name": "MMM YYYY",
                        "value": "MMM YYYY"
                    },
                    {
                        "name": "YYYY MMM",
                        "value": "YYYY MMM"
                    },
                    {
                        "name": "MM YYYY",
                        "value": "MM YYYY"
                    },
                    {
                        "name": "MM-YYYY",
                        "value": "MM-YYYY"
                    },
                    {
                        "name": "MM.YYYY",
                        "value": "MM.YYYY"
                    },
                    {
                        "name": "MM/YYYY",
                        "value": "MM/YYYY"
                    },
                    {
                        "name": "M YYYY",
                        "value": "M YYYY"
                    },
                    {
                        "name": "M-YYYY",
                        "value": "M-YYYY"
                    },
                    {
                        "name": "M.YYYY",
                        "value": "M.YYYY"
                    },
                    {
                        "name": "M/YYYY",
                        "value": "M/YYYY"
                    },
                    {
                        "name": "YYYY M",
                        "value": "YYYY M"
                    },
                    {
                        "name": "YYYY-M",
                        "value": "YYYY-M"
                    },
                    {
                        "name": "YYYY.M",
                        "value": "YYYY.M"
                    },
                    {
                        "name": "YYYY/M",
                        "value": "YYYY/M"
                    },
                    {
                        "name": "YYYY MM",
                        "value": "YYYY MM"
                    },
                    {
                        "name": "YYYY-MM",
                        "value": "YYYY-MM"
                    },
                    {
                        "name": "YYYY.MM",
                        "value": "YYYY.MM"
                    },
                    {
                        "name": "YYYY/MM",
                        "value": "YYYY/MM"
                    }
                ]
            },
            {
                "displayName": "Month Day Year Format",
                "name": "month_day_year_format",
                "type": "options",
                "default": "",
                "description": "If set, updates the full date display format.",
                "options": [
                    {
                        "name": "MMM D, YYYY",
                        "value": "MMM D, YYYY"
                    },
                    {
                        "name": "D MMM YYYY",
                        "value": "D MMM YYYY"
                    },
                    {
                        "name": "YYYY MM DD",
                        "value": "YYYY MM DD"
                    },
                    {
                        "name": "YYYY-MM-DD",
                        "value": "YYYY-MM-DD"
                    },
                    {
                        "name": "YYYY.MM.DD",
                        "value": "YYYY.MM.DD"
                    },
                    {
                        "name": "YYYY/MM/DD",
                        "value": "YYYY/MM/DD"
                    },
                    {
                        "name": "YYYY M DD",
                        "value": "YYYY M DD"
                    },
                    {
                        "name": "YYYY-M-DD",
                        "value": "YYYY-M-DD"
                    },
                    {
                        "name": "YYYY.M.DD",
                        "value": "YYYY.M.DD"
                    },
                    {
                        "name": "YYYY/M/DD",
                        "value": "YYYY/M/DD"
                    },
                    {
                        "name": "YYYY MM D",
                        "value": "YYYY MM D"
                    },
                    {
                        "name": "YYYY-MM-D",
                        "value": "YYYY-MM-D"
                    },
                    {
                        "name": "YYYY.MM.D",
                        "value": "YYYY.MM.D"
                    },
                    {
                        "name": "YYYY/MM/D",
                        "value": "YYYY/MM/D"
                    },
                    {
                        "name": "YYYY M D",
                        "value": "YYYY M D"
                    },
                    {
                        "name": "YYYY-M-D",
                        "value": "YYYY-M-D"
                    },
                    {
                        "name": "YYYY.M.D",
                        "value": "YYYY.M.D"
                    },
                    {
                        "name": "YYYY/M/D",
                        "value": "YYYY/M/D"
                    },
                    {
                        "name": "DD MM YYYY",
                        "value": "DD MM YYYY"
                    },
                    {
                        "name": "DD-MM-YYYY",
                        "value": "DD-MM-YYYY"
                    },
                    {
                        "name": "DD.MM.YYYY",
                        "value": "DD.MM.YYYY"
                    },
                    {
                        "name": "DD/MM/YYYY",
                        "value": "DD/MM/YYYY"
                    },
                    {
                        "name": "DD M YYYY",
                        "value": "DD M YYYY"
                    },
                    {
                        "name": "DD-M-YYYY",
                        "value": "DD-M-YYYY"
                    },
                    {
                        "name": "DD.M.YYYY",
                        "value": "DD.M.YYYY"
                    },
                    {
                        "name": "DD/M/YYYY",
                        "value": "DD/M/YYYY"
                    },
                    {
                        "name": "D MM YYYY",
                        "value": "D MM YYYY"
                    },
                    {
                        "name": "D-MM-YYYY",
                        "value": "D-MM-YYYY"
                    },
                    {
                        "name": "D.MM.YYYY",
                        "value": "D.MM.YYYY"
                    },
                    {
                        "name": "D/MM/YYYY",
                        "value": "D/MM/YYYY"
                    },
                    {
                        "name": "D M YYYY",
                        "value": "D M YYYY"
                    },
                    {
                        "name": "D-M-YYYY",
                        "value": "D-M-YYYY"
                    },
                    {
                        "name": "D.M.YYYY",
                        "value": "D.M.YYYY"
                    },
                    {
                        "name": "D/M/YYYY",
                        "value": "D/M/YYYY"
                    },
                    {
                        "name": "M D YYYY",
                        "value": "M D YYYY"
                    },
                    {
                        "name": "M-D-YYYY",
                        "value": "M-D-YYYY"
                    },
                    {
                        "name": "M.D.YYYY",
                        "value": "M.D.YYYY"
                    },
                    {
                        "name": "M/D/YYYY",
                        "value": "M/D/YYYY"
                    },
                    {
                        "name": "MM D YYYY",
                        "value": "MM D YYYY"
                    },
                    {
                        "name": "MM-D-YYYY",
                        "value": "MM-D-YYYY"
                    },
                    {
                        "name": "MM.D.YYYY",
                        "value": "MM.D.YYYY"
                    },
                    {
                        "name": "MM/D/YYYY",
                        "value": "MM/D/YYYY"
                    },
                    {
                        "name": "MM DD YYYY",
                        "value": "MM DD YYYY"
                    },
                    {
                        "name": "MM-DD-YYYY",
                        "value": "MM-DD-YYYY"
                    },
                    {
                        "name": "MM.DD.YYYY",
                        "value": "MM.DD.YYYY"
                    },
                    {
                        "name": "MM/DD/YYYY",
                        "value": "MM/DD/YYYY"
                    },
                    {
                        "name": "M DD YYYY",
                        "value": "M DD YYYY"
                    },
                    {
                        "name": "M-DD-YYYY",
                        "value": "M-DD-YYYY"
                    },
                    {
                        "name": "M.DD.YYYY",
                        "value": "M.DD.YYYY"
                    },
                    {
                        "name": "M/DD/YYYY",
                        "value": "M/DD/YYYY"
                    }
                ]
            },
            {
                "displayName": "Month Day Format",
                "name": "month_day_format",
                "type": "options",
                "default": "",
                "description": "If set, updates the month and day display format.",
                "options": [
                    {
                        "name": "MMM D",
                        "value": "MMM D"
                    },
                    {
                        "name": "MMM DD",
                        "value": "MMM DD"
                    },
                    {
                        "name": "D MMM",
                        "value": "D MMM"
                    },
                    {
                        "name": "DD MMM",
                        "value": "DD MMM"
                    },
                    {
                        "name": "MM D",
                        "value": "MM D"
                    },
                    {
                        "name": "MM-D",
                        "value": "MM-D"
                    },
                    {
                        "name": "MM.D",
                        "value": "MM.D"
                    },
                    {
                        "name": "MM/D",
                        "value": "MM/D"
                    },
                    {
                        "name": "MM DD",
                        "value": "MM DD"
                    },
                    {
                        "name": "MM-DD",
                        "value": "MM-DD"
                    },
                    {
                        "name": "MM.DD",
                        "value": "MM.DD"
                    },
                    {
                        "name": "MM/DD",
                        "value": "MM/DD"
                    },
                    {
                        "name": "M D",
                        "value": "M D"
                    },
                    {
                        "name": "M-D",
                        "value": "M-D"
                    },
                    {
                        "name": "M.D",
                        "value": "M.D"
                    },
                    {
                        "name": "M/D",
                        "value": "M/D"
                    },
                    {
                        "name": "M DD",
                        "value": "M DD"
                    },
                    {
                        "name": "M-DD",
                        "value": "M-DD"
                    },
                    {
                        "name": "M.DD",
                        "value": "M.DD"
                    },
                    {
                        "name": "M/DD",
                        "value": "M/DD"
                    },
                    {
                        "name": "D MM",
                        "value": "D MM"
                    },
                    {
                        "name": "D-MM",
                        "value": "D-MM"
                    },
                    {
                        "name": "D.MM",
                        "value": "D.MM"
                    },
                    {
                        "name": "D/MM",
                        "value": "D/MM"
                    },
                    {
                        "name": "DD MM",
                        "value": "DD MM"
                    },
                    {
                        "name": "DD-MM",
                        "value": "DD-MM"
                    },
                    {
                        "name": "DD.MM",
                        "value": "DD.MM"
                    },
                    {
                        "name": "DD/MM",
                        "value": "DD/MM"
                    },
                    {
                        "name": "D M",
                        "value": "D M"
                    },
                    {
                        "name": "D-M",
                        "value": "D-M"
                    },
                    {
                        "name": "D.M",
                        "value": "D.M"
                    },
                    {
                        "name": "D/M",
                        "value": "D/M"
                    },
                    {
                        "name": "DD M",
                        "value": "DD M"
                    },
                    {
                        "name": "DD-M",
                        "value": "DD-M"
                    },
                    {
                        "name": "DD.M",
                        "value": "DD.M"
                    },
                    {
                        "name": "DD/M",
                        "value": "DD/M"
                    }
                ]
            },
            {
                "displayName": "Show Am Pm",
                "name": "show_am_pm",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether times use a 12-hour (AM/PM) or 24-hour clock."
            },
            {
                "displayName": "Week Starts On",
                "name": "week_starts_on",
                "type": "options",
                "default": "",
                "description": "If set, updates the day on which a calendar week begins.",
                "options": [
                    {
                        "name": "Sunday",
                        "value": "sunday"
                    },
                    {
                        "name": "Monday",
                        "value": "monday"
                    }
                ]
            },
            {
                "displayName": "Always Display Year",
                "name": "always_display_year",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether dates always include the year."
            },
            {
                "displayName": "Always Display Weekday",
                "name": "always_display_weekday",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether weekday names are shown when displaying dates."
            }
        ]
    },
    {
        "displayName": "Additional Fields",
        "name": "additionalFields",
        "type": "collection",
        "placeholder": "Add Field",
        "default": {},
        "displayOptions": {
            "show": {
                "resource": [
                    "user"
                ],
                "operation": [
                    "updateUserAccountSettings"
                ]
            }
        },
        "options": [
            {
                "displayName": "Auto Review Transaction On Update",
                "name": "auto_review_transaction_on_update",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether transactions are marked as reviewed when their date, category, payee, amount, account, or notes are changed."
            },
            {
                "displayName": "Auto Review Transaction On Creation",
                "name": "auto_review_transaction_on_creation",
                "type": "boolean",
                "default": false,
                "description": "If set, updates whether new manual transactions start as reviewed or unreviewed."
            },
            {
                "displayName": "Default Manual Account Id",
                "name": "default_manual_account_id",
                "type": "string",
                "default": "",
                "description": "If set, updates the manual account selected by default when the user creates a manual transaction in the current budgeting account. Must identify a manual account returned by [GET /manual_accounts](#tag/manual_accounts/GET/manual_accounts) for the current budgeting account. Set to `null` to clear the selection."
            }
        ]
    },
];
//# sourceMappingURL=UserDescription.js.map