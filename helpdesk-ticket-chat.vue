<template>
    <div>

        <template v-if="activeTicketData.id">

            <chat-textarea  />

            <div class="row">
                <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">

                    <div class="message__robot" v-if="comments && robotMessage">
                        <div class="message__header">
                            <span class="message__date">{{ robotDate }}</span>
                        </div>
                        <div class="message__body">
                            <p>Здравствуйте. Мы получили Ваше обращение.</p>
                            <p>Нам понадобится некоторое время для подготовки ответа. Пожалуйста, подождите.</p>
                        </div>
                        <div class="message__decoration"></div>
                    </div>
                    
                    <template v-if="comments">
                        <message v-for="(comment, index) in comments"
                                 :key="index"
                                 :index="index"
                                 :addQuote="addQuote"
                                 :comment="comment"
                                 :comments="comments"
                                 :openModal="openModal" />
                    </template>
                    <template v-else>
                        <img  src="/img/preloader.svg" alt="Загрузка">
                    </template>
                </div>
            </div>

            <image-modal
                    v-if="modalImage.isVisible"
                    :url="modalImage.url"
                    @close-modal="modalImage.isVisible = !modalImage.isVisible"
            />
        </template>
        <p v-else><img src="/img/preloader.svg" alt="" class="preloader_image"></p>

    </div>
</template>

<script>
    import ImageModal from '../common/image-modal'
    import Message from './message'
    import ChatTextarea from './chat-textarea'
    import { mapActions, mapGetters, mapMutations } from 'vuex';

    export default {
        components: {
            ImageModal,
            Message,
            ChatTextarea
        },
        data() {
            return {
                modalImage: {
                    isVisible: false,
                    url: ''
                },
            }
        },

        mounted() {
            this.readTicket(this.activeTicketData.id);
            this.getComments(this.activeTicketData.id);
        },

        computed: {
            ...mapGetters(['comments', 'activeTicketData']),

            /* Generate current date?... */
            robotDate() {
                return moment().format('D MMM в HH:mm');
            },

            /* Define robot message status */
            robotMessage() {
                let status = true;
                
                if(this.comments) {
                    this.comments.forEach(elem => {
                        if(elem.author.is_support) {
                            status = false
                        }
                    })
                }

                return status;
            },

        },

        methods: {
            ...mapActions(['readTicket', 'getComments']),
            ...mapMutations(['addQuote']),

            // получаем клик по картинке в текущем сообщении, достаем из её атрибута ссылку и передаем её в модалку
            openModal(event) {
                if (event.target && event.target.classList && event.target.classList.contains('current-message__image')) {
                    this.modalImage.isVisible = true;
                    this.modalImage.url = event.target.getAttribute('src');
                }
            },
        }

    }
</script>

<style lang="scss">
    @import '../../../sass/settings/_mixins.scss';
    @import '../../../sass/modules/notification.scss';

    .row.info-panel {
        z-index: 999 !important;
    }

    @media (max-width: 768px) {
        .col-xs-offset-1 {
            margin-left: 8.33333333%;
        }
    }

    @media (min-width: 768px) {
        .col-sm-offset-1 {
            margin-left: 8.33333333%;
        }
    }

    @media (min-width: 992px) {
        .col-md-offset-2 {
            margin-left: 16.66666667%;
        }

        .col-md-3 {
            width: 25%;
        }
    }

    @media (min-width: 1200px) {
        .col-lg-2, .col-lg-4, .col-lg-6 {
            padding: 0 16px 0;
            margin: 0 0 10px 0;
        }

        .col-lg-offset-3 {
            margin-left: 25%;
        }

        .col-lg-6 {
            width: 50%;
        }

        .col-lg-4 {
            width: 33.33333333%;
        }

        .col-lg-2 {
            width: 16.66666667%;
        }
    }

    .text__line {
        margin: 0;
    }

    .send-sup-mail {
        width: 100%;
        height: 39px;
    }

    .tickets__list {
        position: relative;
        margin-bottom: 15px;
        padding-left: 0;
    }

    .message__robot {
        position: relative;
        display: inline-block;
        padding: 10px 20px;
        margin-bottom: 20px;
        border: 1px solid #E5F5F5;
        border-radius: 5px 5px 5px 0;
        width: 100%;
        min-width: 51%;
        max-width: 100%;
        background-color: #edf8f8;

        .message__body {
            padding-top: 5px;

            p {
                margin-bottom: 0;
            }
        }

        &:after {
            position: absolute;
            bottom: 5px;
            left: -40px;
            content: 'headset_mic';
            display: inline-block;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: 19px;
            line-height: 29px;
            text-transform: none;
            text-align: center;
            vertical-align: middle;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
            text-rendering: optimizeLegibility;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-feature-settings: 'liga';
            font-feature-settings: 'liga';
            color: #fff;
            background-color: #006A78;
        }

        &:before {
            position: absolute;
            bottom: -1px;
            left: -6.5px;
            content: ' ';
            display: block;
            border-style: solid;
            border-width: 0 6px 17px 6px;
            border-color: transparent transparent #E5F5F5 transparent;
            width: 0;
            height: 0;
        }

        .message__decoration {
            position: absolute;
            bottom: 0;
            left: -5px;
            content: ' ';
            display: block;
            border-style: solid;
            border-width: 0 6px 17px 6px;
            border-color: transparent transparent #edf8f8 transparent;
            width: 0;
            height: 0;
        }
    }
</style>
