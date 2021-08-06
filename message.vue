<template>
    <li :class="['ticket__message', messageClasses]">
        <div class="message__header">
            <span class="message__name">{{ comment.author.name }}</span>
            <span class="message__date">{{ formatedDate }}</span>
            <span class="message__quote">
	            <!-- <a @click="addQuote(comment)" class="message__quote-link">
	                Цитировать
	            </a> -->
	        </span></div>
        <div class="message__body">
            <p class="message__text" @click="openModal($event)">
                <quote v-if="comment.comment" :comment="comment.comment"></quote>

                {{ comment.message }}<br>

                <span v-for="attach in comment.links" class="current-message__photo">
	        		<img class="current-message__image" :src="attach.link"/>
	        	</span>
            </p>
        </div>
        <div class="message__decoration"></div>
    </li>
</template>

<script>
    import Quote from './quote'

    export default {
        components: {Quote},

        props: ['index', 'addQuote', 'comment', 'comments', 'openModal'],

        mounted() {
            moment.locale('ru');
        },

        computed: {

            /* Message styling func */
            messageClasses() {
                let isBottomComment = null;
                let isTopComment = null;
                let currentAuthorIsSupport = this.comment.author.is_support;

                if (this.index === (this.comments.length - 1)) {
                    isBottomComment = true;
                } else {
                    let nextAuthorIsSupport = this.comments[this.index + 1].author.is_support;
                    isBottomComment = currentAuthorIsSupport !== nextAuthorIsSupport;
                }

                if (this.index === 0) {
                    isTopComment = true;
                } else {
                    let prevAuthorIsSupport = this.comments[this.index - 1].author.is_support;
                    isTopComment = currentAuthorIsSupport !== prevAuthorIsSupport;
                }

                return {
                    'ticket__message_bottom': isBottomComment,
                    'ticket__message_top': isTopComment,
                    'ticket__message_support': this.comment.author.is_support,
                    'ticket__message_user': !this.comment.author.is_support,
                }
            },

            /* Переформатируем дату сообщения */
            formatedDate() {
                return moment(this.comment.created_at).format('D MMM в HH:mm');
            },
        },
    }
</script>

<style lang="scss">
    .ticket__message {
        position: relative;
        display: inline-block;
        padding: 10px 20px;
        margin-bottom: 5px;
        width: auto;
        min-width: 100%;
        max-width: 100%;

        &_top {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

        &_bottom {
            margin-bottom: 20px;
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 0;

            &:after {
                position: absolute;
                bottom: 5px;
                left: -40px;
                vertical-align: middle;
                content: " ";
                display: inline-block;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                font-family: 'Material Icons';
                font-weight: normal;
                font-style: normal;
                font-size: 19px;
                line-height: 29px;
                text-align: center;
                text-transform: none;
                letter-spacing: normal;
                word-wrap: normal;
                white-space: nowrap;
                direction: ltr;
                text-rendering: optimizeLegibility;
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-feature-settings: 'liga';
                font-feature-settings: 'liga';
                color: #fff;
            }

            &:before {
                position: absolute;
                bottom: -1px;
                left: -6.5px;
                content: ' ';
                display: block;
                border-style: solid;
                border-width: 0 6px 17px 6px;
                width: 0;
                height: 0;
            }

            .message__decoration {
                position: absolute;
                bottom: 0px;
                left: -5px;
                content: ' ';
                display: block;
                border-style: solid;
                border-width: 0 6px 17px 6px;
                width: 0;
                height: 0;
            }
        }

        &_support {
            border: 1px solid #E5F5F5;
            background-color: #edf8f8;

            .message__decoration {
                border-color: transparent transparent #edf8f8 transparent;
            }
        }

        &_user {
            border: 1px solid #F2F2F2;
            background-color: #f6f6f6;

            .message__decoration {
                border-color: transparent transparent #f6f6f6 transparent;
            }

        }

        &_support.ticket__message_bottom {
            &:after {
                content: 'headset_mic';
                background-color: #006A78;
            }

            &:before {
                border-color: transparent transparent #E5F5F5 transparent;
            }
        }

        &_user.ticket__message_bottom {
            &:after {
                content: 'person';
                background-color: #B2B2B2;
            }

            &:before {
                border-color: transparent transparent #F2F2F2 transparent;
            }
        }
    }

    .message__name {
        margin-right: 5px;
    }

    .message__name,
    .message__date {
        display: block;
        float: left;
        font-family: Roboto;
        line-height: normal;
        font-size: 12px;
        color: #696969;
    }

    .message__quote {
        display: block;
        float: right;
        font-family: Roboto;
        line-height: normal;
        font-size: 12px;
        color: #696969;
    }

    .message__blockquote {
        padding: 0 5px;
        margin-bottom: 5px;
        border-left: 3px solid #e2e2e2;
    }

    .message__header {
        &:before, &:after {
            content: '';
            display: table;
        }

        &:after {
            clear: both;
        }
    }

    .message__quote-link {
        color: #696969;

        &:hover {
            color: #e58325;
        }
    }

    .message__user_first {
        display: block;
        padding-bottom: 10px;
    }

    .message__text {
        display: inline-block;
        margin-top: 5px;
        margin-bottom: 0;
        max-width: 100%;
        font-size: 14px;
        word-break: break-word;
        color: #212121;

        p:not(.blockquote-top) {
            margin: 0;
            font-size: 14px;
        }

        & > .blockquote-top:first-of-type {
            margin-top: 5px;
        }

        & > .blockquote > .blockquote-top:first-of-type {
            margin-top: 0;
        }

        .blockquote p:not(.blockquote-top) {
            margin-left: 10px;
        }
    }

    .message__attachment {
        display: block;
        padding-top: 10px;
        font-family: Roboto;
        line-height: normal;
        font-size: 12px;
        color: #696969;
    }

    .blockquote-top {
        padding: 5px 10px 0;
        margin: 20px 0 0 5px;
        border-left: 3px solid rgba(33, 33, 33, 0.3);
        font-size: 12px;
        color: #696969;
    }

    .footer-block {
        display: none;
    }
</style>