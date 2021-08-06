<template>
    <tr :class="['tickets__tr', { 'tickets__tr_unread': !ticket.is_read  }]"
        @click="openInCurrentWindow($event)"
        @mousedown.middle="disableMiddleScroll($event)"
        @mouseup.middle="openInNewWindow($event)">
        <td class="tickets__td tickets__td_right">{{ ticket.redmine_ticket_id }}</td>
        <td class="tickets__td tickets__td_left tickets__td_name">{{ ticket.name }}</td>
        <td class="tickets__td tickets__td_right">{{ formatedDate }}</td>
        <td class="tickets__td tickets__td_left">
            <div v-if="ticket.is_opened" class="tickets__status">
                <i class="material-icons">
                    check
                </i>
                <span>В работе</span>
            </div>
            <div v-else class="tickets__status tickets__status_close">
                <i class="material-icons">
                    close
                </i>
                <span>Закрыто</span>
            </div>
        </td>
    </tr>
</template>
<script>
    import { mapMutations, mapGetters } from 'vuex';

    export default {
        props: ['ticket'],
        mounted() {
            moment.locale('ru');
        },
        methods: {
            ...mapMutations(['openTicketChat']),
            /* Open chat */
            openInCurrentWindow(e) {
                e.preventDefault();
                this.openTicketChat(this.ticket);
            },

            /* Cancel compass when middle btn click */
            disableMiddleScroll(e) {
                e.preventDefault();
            },

            /* Open chat at new window */
            openInNewWindow(e) {
                e.preventDefault();
                this.openTicketChat(this.ticket);
            },
        },
        computed: {
            /* Переформатируем дату сообщения */
            formatedDate() {
                return moment(this.ticket.updated_at).format('D MMM в HH:mm');
            },
        },
    }
</script>
<style lang="scss">

</style>