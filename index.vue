<template>
	<div class="helpdesk-wrapper">
		<div class="helpdesk-wrapper__info">
			<info-panel :title="'Техподдержка'" 
						:infoblocks="information"
						:links="links"
						:help="'/invite-documents/29'" />
		</div>
		<div class="helpdesk-wrapper__body">
				<helpdesk-ticket-chat v-if="activeTicketData" />
				<helpdesk-ticket-create v-show="!activeTicketData" />
				<helpdesk-tickets v-show="!activeTicketData" />
		</div>
	</div>
</template>
<script>
	import InfoPanel from '../common/info-panel'
	import HelpdeskTicketCreate from './helpdesk-ticket-create'
	import HelpdeskTickets from './helpdesk-tickets'
	import HelpdeskTicketChat from './helpdesk-ticket-chat'
	import { mapMutations, mapGetters } from 'vuex';

	export default {
		components: { 
			InfoPanel,
			HelpdeskTicketCreate,
			HelpdeskTickets,
			HelpdeskTicketChat 
		},

		computed: {
			...mapGetters(['activeTicketData']),

			information() {
				let infoArr = null;

				if(this.activeTicketData) {
					infoArr = [];
					infoArr.push({label: 'ID', value: this.activeTicketData.redmine_ticket_id});
					infoArr.push({label: 'Заголовок обращения', value: this.activeTicketData.name});
					infoArr.push({label: 'Статус', value: this.activeTicketData.is_opened ? 'В работе' : 'Закрыто'});
				}

				return infoArr;
			},

			links() {
				let linksArr = null;

				if(this.activeTicketData) {
					linksArr = [];
					linksArr.push({name: 'Назад', href: '', event: this.closeChat});
					linksArr.push({name: 'Новое обращение', href: '', event: this.closeChat});
				}

				return linksArr;
			}
		},
		methods: {

			...mapMutations(['closeTicketChat']),

			closeChat(e) {
				e.preventDefault();
				this.closeTicketChat();
			} 

			/* Get Helpdesk mickroserice id from url. After vuex connect rewrite that func  */
			// getHelpdeskId() {
			//     let helpdesk_id = new URLSearchParams(window.location.search).get('helpdesk_id');

			//     if (helpdesk_id) {
			//         this.helpdesk_id = helpdesk_id;
			//     } else {
			//         showNotify('Ошибка', 'отсутствует id обращения в URL страницы', 'error');
			//     }
			// },

		},
	}

</script>
<style lang="scss">
	.helpdesk-wrapper {
		padding: 62px 2% 20px 2%;

		&__info {}

		&__body {
			padding: 30px 2.4%;
			background-color: #FFFFFF;
		}
	}
</style>