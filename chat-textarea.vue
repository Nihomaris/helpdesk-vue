<template>
    <div class="chat-edit">

        <div class="row">

            <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
                <div class="chat-edit__window">
		    	    <textarea class="chat-edit__area" placeholder="Введите комментарий" maxlength="1024"
                              v-autosize="messageTextArea.newTicketMessage"
                              v-model="message"
                    />
                    <div class="chat-edit__quote">
                        <template v-if="messageTextArea.quote">
                            <div class="chat-edit__quote-container">
                                <div class="chat-edit__quote-icon">
                                    <svg width="27" height="28" viewBox="0 0 27 28" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.25793 12.9169C6.80372 13.5929 6.80475 14.4768 7.26054 15.1517L13.8308 24.8807C14.7278 26.209 13.7761 28 12.1733 28H11.752C11.1402 28 10.562 27.72 10.1827 27.2399L0.207375 14.6142C0.0730612 14.4442 0 14.2339 0 14.0173C0 13.801 0.0727836 13.5911 0.206629 13.4212L10.1827 0.762084C10.562 0.280849 11.1409 0 11.7536 0H12.1839C13.7846 0 14.7367 1.78684 13.8439 3.11545L7.25793 12.9169ZM19.3206 12.9169C18.8664 13.5929 18.8674 14.4768 19.3232 15.1517L25.8934 24.8807C26.7905 26.209 25.8388 28 24.236 28H23.8147C23.2029 28 22.6247 27.72 22.2454 27.2399L12.27 14.6142C12.1357 14.4442 12.0627 14.2339 12.0627 14.0173C12.0627 13.801 12.1354 13.5911 12.2693 13.4212L22.2454 0.762084C22.6246 0.280849 23.2035 0 23.8162 0H24.2466C25.8472 0 26.7993 1.78684 25.9066 3.11545L19.3206 12.9169Z"
                                              fill="#006A78"/>
                                    </svg>
                                </div>
                                <div class="chat-edit__quote-body">
                                    <div class="chat-edit__quote-header">
                                        <span class="chat-edit__quote-author">{{ messageTextArea.quote.author.name }}</span>
                                        <span class="chat-edit__quote-date">{{ formatedDate }}</span>
                                    </div>

                                    <div class="chat-edit__quote-message">{{ messageTextArea.quote.message }}</div>
                                </div>
                                <div class="chat-edit__quote-icon chat-edit__quote-icon_right">
                                    <svg width="27" height="28" viewBox="0 0 27 28" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.25793 12.9169C6.80372 13.5929 6.80475 14.4768 7.26054 15.1517L13.8308 24.8807C14.7278 26.209 13.7761 28 12.1733 28H11.752C11.1402 28 10.562 27.72 10.1827 27.2399L0.207375 14.6142C0.0730612 14.4442 0 14.2339 0 14.0173C0 13.801 0.0727836 13.5911 0.206629 13.4212L10.1827 0.762084C10.562 0.280849 11.1409 0 11.7536 0H12.1839C13.7846 0 14.7367 1.78684 13.8439 3.11545L7.25793 12.9169ZM19.3206 12.9169C18.8664 13.5929 18.8674 14.4768 19.3232 15.1517L25.8934 24.8807C26.7905 26.209 25.8388 28 24.236 28H23.8147C23.2029 28 22.6247 27.72 22.2454 27.2399L12.27 14.6142C12.1357 14.4442 12.0627 14.2339 12.0627 14.0173C12.0627 13.801 12.1354 13.5911 12.2693 13.4212L22.2454 0.762084C22.6246 0.280849 23.2035 0 23.8162 0H24.2466C25.8472 0 26.7993 1.78684 25.9066 3.11545L19.3206 12.9169Z"
                                              fill="#006A78"/>
                                    </svg>
                                </div>
                            </div>
                            <i class="material-icons chat-edit__remove" @click="removeQuote">close</i>
                        </template>
                    </div>
                </div>
            </div>

        </div>

        <div class="row">
            <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 chat-edit__descr">
                <span>
                    <p>Допустимые форматы файлов .jpg .jpeg .png. Максимальный размер файла 10мб</p>
                </span>
            </div>
        </div>

        <div v-if="messageTextArea.files.length" class="row">
            <file-icons :files="messageTextArea.files"
                        class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12"></file-icons>
        </div>

        <div class="row form-actions">
            <input-file :files="messageTextArea.files" :jwt="jwt"
                        class="col-lg-2 col-lg-offset-3 col-md-3 col-md-offset-2 col-sm-4 col-sm-offset-1 col-xs-5"></input-file>
            <div class="form-actions__send col-lg-4 col-md-5 col-sm-6 col-xs-7 send-button">
                <input type="button"
                       value="Отправить"
                       class="btn st-button send__message"
                       :disabled="messageTextArea.isLoading"
                       @click="addComment">
            </div>
        </div>
        <div v-if="messageTextArea.isLoading"  class="chat-edit__preloader">
            <img src="/img/preloader.svg" alt="" class="chat-edit__preloader-img">
        </div> 
    </div>
</template>
<script>
    import { FileIcons, InputFile } from '../common/file-attachment';
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import showNotify from '../../modules/notification';

    export default {

        components: {
            InputFile,
            FileIcons,
        },

        methods: {

            ...mapActions(['sendNewComment', 'getComments']),
            ...mapMutations(['removeQuote', 'updateTicketMessage']),

            /* 
                Подготовим данные нового коментария
                Prepare comment data before sending 
            */
            addComment() {
                let vm = this;

                if (vm.messageTextArea.newTicketMessage.trim() === '') {
                    showNotify('Сообщение не отправлено', 'Вы не можете отправить пустое сообщение', 'default');
                    return;
                }

                let formData = new FormData();

                formData.append('ticket_id', vm.activeTicketData.id);
                formData.append('message', vm.messageTextArea.newTicketMessage.trim());

                if (vm.messageTextArea.quote) {
                    formData.append('comment_id', vm.messageTextArea.quote.id);
                } 

                vm.sendNewComment({ files: vm.messageTextArea.files, formData: formData })

            },
        },

        computed: {
            ...mapGetters(['jwt', 'activeTicketData', 'messageTextArea']),

            /* Переформатируем дату сообщения */
            formatedDate() {
                return moment(this.messageTextArea.quote.created_at).format('D MMM в HH:mm');
            },
            
            /*
                Необходимо, чтобы v-model работал с vuex state
            */
            message: {
                get () {
                  return this.messageTextArea.newTicketMessage;
                },
                set (value) {
                  this.updateTicketMessage(value);
                }
            }
        },

    }
</script>
<style lang="scss">

    @import '../../../sass/settings/_mixins.scss';
    @import '../../../sass/modules/notification.scss';


    .chat-edit {

        position: relative;

        &__preloader {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: 100%;
            background-color: rgba(255,255,255,0.8);
        }

        &__preloader-img {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            margin: 0 auto;
        }

        &__window {
            display: flex;
            flex-direction: column-reverse;
        }

        &__quote {
            position: relative;
            min-height: 3px;
            box-sizing: border-box;
            border: 1px solid #B4B4B4;
            border-bottom: none;
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
            @include transition();
        }

        &__quote-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 0 12px;
            padding: 10px 40px 10px 0;
            border-bottom: 1px solid #E2E2E2
        }

        &__quote-header {
            display: block;
            margin-bottom: 5px;
            font-family: Roboto;
            line-height: normal;
            font-size: 12px;
            color: #696969;
        }

        &__quote-author {
            margin-right: 5px;
        }

        &__quote-date {

        }

        &__quote-message {
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        &__quote-icon {
            max-width: 27px;
            height: 28px;
            flex-grow: 1;

            &_right {
                transform: rotateY(180deg);
            }
        }

        &__quote-body {
            flex-grow: 1;
            padding: 0 10px;
            max-width: 95%;
        }

        &__descr {
            text-align: left;
            font-size: 12px;
            color: #696969;
            line-height: 14px;
        }

        &__remove {
            position: absolute;
            top: 10px;
            right: 12px;
            font-size: 16px;
            cursor: pointer;
            color: #696969;
        }

        &__remove:hover {
            color: #e58325;
        }

        &__area {
            display: block;
            padding: 6px 12px;
            max-width: 100%;
            min-height: 70px;
            width: 100%;
            height: auto;
            box-sizing: border-box;
            border: 1px solid #B4B4B4;
            border-top: none;
            border-bottom-left-radius: 2px;
            border-bottom-right-radius: 2px;
            box-sizing: border-box;
            font-family: Roboto;
            font-weight: normal;
            line-height: 20px;
            font-size: 14px;
            color: #212121;
            resize: none;
            @include transition();

            &:hover {
                border: 1px solid #489090;
                border-top: none;
                box-shadow: inset 0 0 3px #fff, 0 1px 1px rgba(0, 0, 0, .1);
            }

            &:focus {
                color: #212121;
                border: 1px solid #489090;
                border-top: none;
                box-shadow: inset 0 0 3px #fff, 0 1px 1px rgba(0, 0, 0, .1);
                outline: none;
            }

            &:hover + div.chat-edit__quote {
                border: 1px solid #489090;
                border-bottom: none;
            }

            &:focus + div.chat-edit__quote {
                border: 1px solid #489090;
                border-bottom: none;
            }

            &::-moz-placeholder {
                color: #999;
                opacity: 1;
            }

            &::-ms-input-placeholder {
                color: #999;
            }

            &::-webkit-input-placeholder {
                color: #999;
            }
        }

    }

    .form-actions {
        display: flex;
        align-items: center;

        @media (max-width: 440px) {
            flex-wrap: wrap;
            &__attach-file,
            &___send {
                padding-top: 0;
                width: 100%;
            }
        }
    }

    .send-button {
        margin-left: 0;
    }

    .attachment-links {
        color: rgba(33, 33, 33, .3);
    }

    .current-message {
        &__photo {
            display: inline-block;
            width: 50px;
            height: 30px;
            padding-top: 10px;
            margin: 0 10px 10px 0;
            background-position: center;
            background-size: cover;
            padding-right: 3px;
        }

        &__image {
            max-height: 100%;
            max-width: 100%;
            cursor: pointer;
        }
    }

    // Кнопка отправить
    .send__message {
        margin-right: 0;
        margin-top: 7px;
        margin-bottom: 10px;
        width: 100%;
        height: 39px;
    }

    .sup-textarea-value {
        resize: none;
        border-color: #C5C5C5;
        box-shadow: none;
    }

    .preloader_image {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -18px 0 0 -18px;
    }

    @media(max-width: 768px) {
        .chat-edit__quote-icon_right {
            display: none;
        }

        .chat-edit__quote-container {
            padding-right: 10px;
        }
    }

</style>