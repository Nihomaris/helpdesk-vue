<template>
    <div>
        <div class="helpdesk__title">
            Список обращений
        </div>
        <div class="table-responsive">
            <table class="tickets">
                <thead>
                <tr>
                    <th class="tickets__header tickets__header_right">ID</th>
                    <th class="tickets__header tickets__header_left">Заголовок</th>
                    <th class="tickets__header tickets__header_right">Обновлено</th>
                    <th class="tickets__header tickets__header_left">Статус</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="tickets">
                    <ticket v-for="(ticket, index) in reverseTikets"
                            :key="index"
                            :ticket="ticket" />
                </template>
                <template v-else>
                    <div class="tickets__preloader">
                        <img src="/img/preloader.svg" alt="Загрузка">
                    </div>
                </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import showNotify from '../../modules/notification';
    import Ticket from './ticket';
    import { mapActions, mapGetters } from 'vuex';

    export default {
        components: {
            Ticket
        },

        mounted() {
            this.getTickets();
        },

        methods: {
            ...mapActions(['getTickets']),
        },

        computed: {
            ...mapGetters(['tickets']),

            /* Change ticket order */
            reverseTikets() {
                if (this.tickets) {
                    return this.tickets.slice().reverse();
                } else {
                    return null;
                }
            },
        },

    }
</script>

<style lang="scss">
    @import '../../../sass/settings/_mixins.scss';
    @import '../../../sass/modules/notification.scss';

    .helpdesk__title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
        display: inline-block;
    }

    .tickets {
        font-family: 'Roboto';
        border-collapse: separate;
        border-spacing: 0 6px;
    }

    .tickets__header {
        font-family: 'Roboto';
        font-size: 14px;
        color: #696969;
        font-weight: normal;
        padding-left: 30px;
        padding-bottom: 10px;

        &:first-child {
            padding-left: 10px;
        }

        &_left {
            text-align: left;
        }

        &_right {
            text-align: right;
        }

    }

    .tickets__preloader {}

    .tickets__tr {
        font-family: 'Roboto';
        height: 22px;

        &_unread {
            background: rgba(0, 106, 120, 0.1);

            &::after {
                vertical-align: middle;
                content: 'email';
                font-family: 'Material Icons';
                font-weight: normal;
                font-style: normal;
                font-size: 24px;
                display: table-cell;
                padding: 0px 12px 0 0;
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
                line-height: 1;
                text-transform: none;
                letter-spacing: normal;
                word-wrap: normal;
                white-space: nowrap;
                direction: ltr;
                -webkit-font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-feature-settings: 'liga';
                font-feature-settings: 'liga';
                color: #006A78;
            }

            .tickets__td {

                &_name {
                    font-weight: bold;
                }

                &:last-child {
                    padding-right: 0;
                }

            }

            &, &:hover {
                .tickets__td:last-child {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
            }

            &:hover::after {
                background: #FCE5D1;
            }

        }

        &:hover {
            cursor: pointer;

            .tickets__td {
                background: #FCE5D1;

                &_name {
                    text-decoration: underline;
                    color: #E58325;
                }

            }

        }
    }

    .tickets__td {
        font-family: 'Roboto';
        color: #212121;
        line-height: 17px;
        font-size: 14px;
        padding: 1px 0 1px 30px;

        &:first-child {
            padding-left: 10px;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }

        &:last-child {
            padding-right: 5px;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
        }

        &_right {
            text-align: right;
        }

        &_left {
            text-align: left;
        }

        &_name {
            min-width: 390px;
        }

    }

    .tickets__status {
        width: 77px;
        height: 20px;
        text-align: left;
        color: #696969;
        font-size: 12px;
        line-height: 17px;

        i {
            vertical-align: middle;
            margin: 0 2px 0 5px;
            font-size: 15px;
            color: #479D6C;
        }

        span {
            vertical-align: middle;
        }

        &_close {

            i {
                color: #D42C27;
            }

        }

    }
</style>