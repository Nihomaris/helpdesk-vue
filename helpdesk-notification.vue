<template>
	<div class="helpdesk-notification">
	    <a class="helpdesk-notification__link helpdesk-notification__link_left" :class="{'helpdesk-notification__link_active': count > 0}" href="/helpdesk">
	    	<div class="helpdesk-notification__container">
		    	<span class="helpdesk-notification__text">Непрочитанных сообщений</span>

		    	<template v-if="count !== null">
		    		<span class="helpdesk-notification__count"><span class="helpdesk-notification__num">{{ count }}</span></span>
		    	</template>

		    	<template v-else>
		    		<img class="helpdesk-notification__preloader" src="/img/preloader.svg" alt="">
		    	</template>
		    	
	    	</div>
	    </a>

	    <a class="helpdesk-notification__link helpdesk-notification__link_right" href="/helpdesk">
	    	<span class="helpdesk-notification__text">Задать вопрос в техподдержку</span>
	    </a>
	</div>
</template>
<script>
	import { HELPDESK_HOST } from '../../config'
	import showNotify from '../../modules/notification';

	export default {
		data() {
			return {
				count: null,
				jwt: '',
			}
		},

		mounted() {
			this.getJwt();
		},

		methods: {
			/* 
				Пулучаем jwt для доступа к микросервису helpdesk
				Fetch jwt for access to helpdesk microservice
			*/
			getJwt() {
			    let vm = this;

			    axios.get('/jwt').then(res => {
			        if (res.status === 200) {
			            vm.jwt = res.data.jwt;

			            this.getTicketCount()
			        }
			    }).catch(err => {
			        // showNotify('Ошибка', 'при попытке получения токена', 'error');
			        console.warn('Ошибка при попытке получения токена', err)
			    })
			},

			getTicketCount() {
				let vm = this;

				axios.get(`${HELPDESK_HOST}/v1/notifications/count`, {
					headers: {Authorization: `bearer ${vm.jwt}`},
				}).then(res => {
					if(res.status === 200) {
	
						this.count = res.data.data.count;

					}
				}).catch(err => {
					// showNotify('Ошибка', 'Не удалось получить информацию о непрочитанных сообщениях', 'error');
					console.warn('Не удалось получить информацию о непрочитанных сообщениях', err)
				})
			}
		}
	}
</script>
<style lang="scss">
	.helpdesk-notification { 

		&__preloader {
			width: 15px;
			margin-left: 10px;
		}

		&__link {
			display: inline-block;
			height: 100%;
			padding: 0 20px;
			font-family: Roboto;
			font-style: normal;
			font-weight: normal;
			font-size: 12px;
			color: #ffffff;

			&_active {
				background-color: #E58325;
				color: #ffffff;
			}
		}

		&__link_left {
				&:hover {
					color: #FFFFFF;
				}
		}

		&__link_right {
			&:hover {
				background-color: transparent;
				color: #ECAC6F;

				.helpdesk-notification__text {
					border-bottom: 1px solid #ECAC6F;
				}
			}

			&:active {
				background-color: transparent;
				color: #ECAC6F;
			}
		}
	
		&__text {
			border-bottom: 1px solid #ffffff;
		}


		&__count {
			position: relative;
			display: inline-block;
			width: 15px;
			height: 12px;
			margin-left: 10px;
			text-align: center;
			vertical-align: middle;
			background-color: #ffffff;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			border-bottom-right-radius: 2px;

			&:before {
				content: '';
				position: absolute;
				bottom: -3px;
				left: 0;
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 3px 3px 0 0;
				border-color: #ffffff transparent transparent transparent;

			}
		}

		&__num {
			font-family: Roboto;
			font-style: normal;
			font-weight: bold;
			font-size: 10px;
			line-height: 12px;
			vertical-align: top;
			color: #212121;
		}
	}

	@media(max-width: 768px) {
		.helpdesk-notification {
			width: 100%;
			font-size: 0;

			&__link {
				width: 50%;
				padding-top: 13px;
				text-align: center;
			}
			&__link_right {
			}
		}
	}

	@media(max-width: 450px) {
		.helpdesk-notification {

			&__link {
				float: left;
				text-align: left;
				padding: 5px 15px 0 15px;
			}
			&__container {
				display: block;
				width: 130px;
				margin: 0 auto;
			}
			&__text {
				display: block;
			    float: left;
			    width: 100px;
			    border-bottom: none;
			}
			&__count {
				margin-top: 11px;
			}

			&__link_right{
				.helpdesk-notification__text {
					float: none;
					margin: 0 auto;
				}
			}
		}
	}

</style>