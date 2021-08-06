<template>
    <div class="helpdesk-create">
        <div class="helpdesk__title">
            Новое обращение
        </div>

        <form class="form-horizontal" action="" method="post" enctype="multipart/form-data" id="helpdesk-form">

            <div class="row">
                <div class="col-lg-2 col-md-12 no-padding-align-right col_no-bg">
                    <span>Категория обращения</span>
                </div>
                <div class="col-lg-4 col-md-6 no-padding-input-block col_no-bg">
                    <select class="sup-categories-select form-control st-select">
                        <option value="-1" selected="selected" disabled="disabled"></option>

                        <option v-for="category in categories" :value="category.value">{{ category.name }}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-2 col-md-12 no-padding-align-right col_no-bg">
                    <span>Область вопроса</span>
                </div>
                <div class="col-lg-4 col-md-6 no-padding-input-block col_no-bg">
                    <select class="sup-sub-categories-select sup-sub-categories-select-error form-control st-select">
                        <option value="-1" selected="selected" disabled="disabled"></option>

                        <option v-for="type in subCategories" :value="type.value">{{ type.name }}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-2 col-md-12 no-padding-align-right col_no-bg">
                    <span>Заголовок</span>
                </div>
                <div class="col-lg-4 col-md-6 no-padding-input-block col_no-bg">
                    <input v-model="topicModel" type="text" maxlength="43" class="st-input sup-header">
                </div>
                <div class="col-lg-3 col-md-6 no-padding-align-left">
                    <span>Коротко обозначьте тему.</span>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-2 col-md-12 no-padding-align-right col_no-bg">
                    <span>Описание</span>
                </div>
                <div class="col-lg-4 col-md-6 no-padding-input-block col_no-bg">
                    <textarea v-model="messageModel" maxlength="1024" v-autosize="ticketTextArea.message"
                              class="form-control sup-textarea-value st-textarea"></textarea>
                </div>
                <div class="col-lg-5 col-md-6 no-padding-align-left col_no-bg">
		            <span>
		                <p>Если обращение связано с ошибкой, пожалуйста, опишите подробнее, какие действия совершались до ее возникновения.</p>
		                <p>Приложите, по возможности, скриншот и ссылку страницы с ошибкой.</p>
		                <p>Данная информация значительно ускорит время ответа и избавит от лишних вопросов.</p>
		            </span>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-2 col-md-12 no-padding-align-right col_no-bg"></div>
                <input-file :files="ticketTextArea.files" :jwt="jwt"
                            class="col-lg-4 col-md-6 no-padding-input-block col_no-bg"></input-file>
                <div class="col-lg-5 col-md-6 no-padding-align-left col_no-bg">
                    <span>
                        <p>Допустимые форматы файлов .jpg .jpeg .png. Максимальный размер файла 10мб</p>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-2 col-md-12 no-padding-align-right col_no-bg"></div>
                <file-icons :files="ticketTextArea.files" class="col-lg-4 col-md-6 no-padding-input-block col_no-bg"></file-icons>
            </div>
            <div class="row">
                <div class="col-lg-2 col-md-12 no-padding-align-right col_no-bg">
                </div>
                <div class="col-lg-4 col-md-6 no-padding-input-block col_no-bg">
                    <input @click="createNewTicket" type="button" class="btn st-button send-sup-mail"
                           :class="{'form__button_disabled': ticketTextArea.isLoading}" value="Отправить">
                </div>
                <div class="col-lg-6 col-md-6 col_no-bg"></div>
            </div>
        </form>
        
        <div class="alert alert-danger sup-alert" style="text-align: center">
            <strong>Внимание!</strong> <span class="alert-message"></span>
        </div>
        <div class="alert alert-success sup-sucsess" style="text-align: center">
            <strong></strong> <span class="sucsess-message"></span>
        </div>
        <div v-if="ticketTextArea.isLoading" class="helpdesk-create__preloader">
            <img src="/img/preloader.svg" alt="" class="helpdesk-create__preloader-img">
        </div>
    </div>
</template>

<script>
    import { FileIcons, InputFile } from '../common/file-attachment'
    import { mapActions, mapGetters, mapMutations } from 'vuex';

    /* Define client browser data */
    function defineBrowser() {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }

        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge|YaBrowser)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            if (tem) return tem.slice(1).join(' ').replace('YaBrowser', 'Yandex');
        }

        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);

        return M.join(' ');
    }

    /* Define client OS data */
    function defineOs() {
        let OSName = 'Неизвестная ОС';
        if (navigator.userAgent.indexOf("Linux") > -1) OSName = "Linux";
        if (navigator.appVersion.indexOf("Win") > -1) OSName = "Windows";
        if (navigator.appVersion.indexOf("Mac") > -1) OSName = "MacOS";
        if (navigator.appVersion.indexOf("X11") > -1) OSName = "UNIX";

        return OSName;
    }

    /* Ancient alert functions. Must rewrite */
    function alertColor(message) {
        var alert_object = $(message);

        if ($(alert_object).is(':hidden')) {
            alert_object = $(alert_object).siblings('.chosen-container').children('.chosen-single');
        }

        $(alert_object).addClass('alert_border');

        setTimeout(function () {
            $(alert_object).removeClass('alert_border');
        }, 5000);
    }

    function alertMessage(message) {
        $('.alert-message').text(message);
        $('.sup-alert').css('display', 'block');

        setTimeout(function () {
            $('.sup-alert').hide();
        }, 5000);
    }

    function sucsessMessage(message) {
        $('.sucsess-message').text(message);
        $('.sup-sucsess').css('display', 'block');
        
        setTimeout(function () {
            $('.sup-sucsess').hide();
        }, 7000);
    }

    export default {
        components: {
            InputFile,
            FileIcons
        },
        data() {
            return {
                categories: [
                    {value: '1', name: 'Консультация'},
                    {value: '2', name: 'Ошибка'},
                    {value: '3', name: 'Предложение'},
                ],
                subCategories: [
                    {value: '1', name: 'Финансы'},
                    {value: '2', name: 'Водители'},
                    {value: '3', name: 'Диспетчерская'},
                    {value: '4', name: 'Заказ'},
                    {value: '5', name: 'Интеграции'},
                    {value: '6', name: 'Блокировки'},
                    {value: '7', name: 'Тестирование'},
                ],
            }
        },

        mounted() {
            let vm = this;
            $('.sup-categories-select').chosen({
                disable_search: true,
                allow_single_deselect: true,
                placeholder_text_single: " "
            }).change((e) => {
                vm.setCategoryData(e.target.value)
            })
            $('.sup-sub-categories-select').chosen({
                disable_search: true,
                allow_single_deselect: true,
                placeholder_text_single: " "
            }).change((e) => {
                vm.setSubCategoriesData(e.target.value)
            })
        },

        computed: {
            ...mapGetters(['jwt', 'ticketTextArea']),
            
            /*
                Необходимо, чтобы v-model работал с vuex state
            */
            topicModel: {
                get() {
                  return this.ticketTextArea.topic;
                },
                set(value) {
                  this.updateNewTicketTopic(value);
                }
            },
            
            /*
                Необходимо, чтобы v-model работал с vuex state
            */
            messageModel: {
                get() {
                  return this.ticketTextArea.message;
                },
                set(value) {
                  this.updateNewTicketMessage(value);
                }
            },
        },

        methods: {

            ...mapActions(['sendNewTicket']),
            ...mapMutations(['updateNewTicketMessage', 'updateNewTicketTopic', 'setCategoryData', 'setSubCategoriesData']),

            /* Prepare new ticket data */
            createNewTicket(e) {
                e.preventDefault();

                let vm = this;
                let form_data = new FormData();

                if (!vm.ticketTextArea.categoryData || vm.ticketTextArea.categoryData === '-1') {
                    alertMessage('Вы не выбрали категорию!');
                    alertColor(".sup-categories-select");
                    return false;
                }
                if (!vm.ticketTextArea.subCategoriesData || vm.ticketTextArea.subCategoriesData === '-1') {
                    alertMessage('Вы не выбрали область вопроса!');
                    alertColor(".sup-sub-categories-select");
                    return false;
                }
                if (!vm.ticketTextArea.topic || vm.ticketTextArea.topic === '') {
                    alertMessage('Вы не ввели заголовок!');
                    alertColor('.sup-header');
                    return false;
                }
                if (!vm.ticketTextArea.message || vm.ticketTextArea.message === '') {
                    alertMessage('Вы не заполнили описание!');
                    alertColor('.sup-textarea-value');
                    return;
                }

                form_data.append('cat', vm.ticketTextArea.categoryData);
                form_data.append('subcat', vm.ticketTextArea.subCategoriesData);
                form_data.append('topic', vm.ticketTextArea.topic);
                form_data.append('description', vm.ticketTextArea.message);
                form_data.append('screen', window.screen.width + 'x' + window.screen.height);
                form_data.append('os', defineOs());
                form_data.append('browser', defineBrowser());
                form_data.append('userAgent', navigator.userAgent);
                form_data.append('url', window.location.href);
                
                $('.sup-categories-select').val('-1').trigger("chosen:updated");
                $('.sup-sub-categories-select').val('-1').trigger("chosen:updated");

                this.sendNewTicket({ files: vm.ticketTextArea.files, formData: form_data });

            },
        },
    }
</script>
<style lang="scss">

    .helpdesk-create {
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
    }

    #helpdesk-form {
        margin-bottom: 90px;
        margin-left: 120px;
    }

    #helpdesk-form > .row > [class^='col'] {
        margin-bottom: 5px;
    }

    #helpdesk-form .chosen-container-single .chosen-single div b::after {
        color: #C4C4C4;
    }

    #helpdesk-form .chosen-container-single .chosen-single,
    #helpdesk-form .st-input,
    #helpdesk-form .st-textarea {
        border-color: #C5C5C5;
    }

    #helpdesk-form .chosen-container-active.chosen-with-drop .chosen-single {
        border-color: #489090;
    }

    #helpdesk-form .st-textarea {
        height: 130px;
        box-shadow: none;
        padding-left: 5px;
        padding-right: 5px;
    }

    #helpdesk-form .send-sup-mail {
        margin-top: 0;
        padding-top: 10px;
        padding-bottom: 10px;
        font-size: 15px;
    }

    @media (max-width: 768px) {

        #helpdesk-form {
            margin-left: 0px;
        }

    }

    .helpdesk {
        display: none;
    }

    // Кнопка прикрепить файл
    .attachment__button {
        display: flex;
        align-items: center;
        padding: 7px 0;
        color: #696969;
    }

    .attachment__text {
        font-size: 12px;
        width: 99px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        line-height: 22px;
        vertical-align: middle;

        &:hover {
            color: #e58325;
        }
    }

    // Стили для прикрепленных файлов
    .attachment-files {
        &__wrapper {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin-left: 0;
            padding: 0;
            padding-top: 5px;

        }

        @media (max-width: 1200px) {
            padding-top: 0;
        }

        &__file {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #B2B2B2;
            border-radius: 5px;
            height: 50px;
            padding: 7px 10px;
            margin-right: 5px;
            width: calc(50% - 5px);

            &:nth-child(4n) {
                width: 25%;
                margin: 0 0 5px 0;
            }

            @media (max-width: 1500px) {
                &, &:nth-child(4n) {
                    width: calc(50% - 5px);
                    margin-right: 5px;
                    margin-bottom: 5px;
                }
            }

            @media (max-width: 568px) {
                &, &:nth-child(4n) {
                    width: calc(50% - 5px);
                    margin-right: 5px;
                    margin-bottom: 5px;
                }
            }

            @media (max-width: 400px) {
                &, &:nth-child(4n) {
                    width: calc(100%);
                    margin-bottom: 5px;
                    margin-right: 0;
                }
            }
        }

        &__content {
            display: flex;
            align-items: center;
        }

        &__file-icon {
            display: flex;
            width: 35px;
            height: 35px;
            margin-right: 7px;
        }

        &__remove {
            font-size: 16px;
            cursor: pointer;
            color: #696969;
        }

        &__filename {
            text-align: left;
        }
    }

    .attachment__icon {
        margin-right: 5px;
        transform: rotate(45deg);
    }

    .attachment__text {
        font-size: 12px;
        width: 99px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        line-height: 22px;
        vertical-align: middle;
    }

    .attachment-links {
        color: rgba(33, 33, 33, .3);
    }

    .form-actions {
        display: flex;
        align-items: center;

        &__attach-file {
            padding-top: 0;
            padding-left: 10px;
        }
    }
</style>