/*
	В этом модуле находится вся логика работы интерфейса хелпдеска.
*/

import { HELPDESK_HOST } from '../../config'
import showNotify from '../../modules/notification'
import axios from 'axios'

/* 
	Данный токен необходим для возможности отмены запросов при переклюении экранов 
*/
const CancelToken = axios.CancelToken;

export default {
	state: {

		/* Объект с выполняющимися запросами к api */
		axiosLoadingRequests: {
			'getTickets': null,
			'getComments': null,
			'sendNewTicket': null,
			'sendNewComment': null,
		},
		
		/* Массивы со списком обращений и комментариев */
		tickets: null,
		comments: null,

		activeTicketData: null,
		
		ticketTextArea: {
			files: [],
			categoryData: null,
			subCategoriesData: null,
			topic: null,
			message: null,
			isLoading: false,
		},
		messageTextArea: {
			files: [],
			quote: null,
            newTicketMessage: '',
            disabled: false,
            isLoading: false,
		},
	},
	actions: {

		/* 
			Получаем список обращений от api
			Fetch tickets list
		*/
		getTickets({state, commit, dispatch, getters}) {
			
			// Инициализируем цикл запросов для получения и обновления токена
			// Initialize queue of requests for fetch jwt
			// REFACTORING
			if(getters.jwt === '') {
				dispatch('fetchJwt', 'getTickets');
				return false;
			}
			
		    axios.get(`${ HELPDESK_HOST }/v1/tickets/`, {
		        headers: {Authorization: `bearer ${getters.jwt}`},
		    }).then(res => {
		        if (res.status === 200) {
		            commit('setTickets', res.data.data.tickets)
		            dispatch('helpdeskLongpool');
		        }
		    }).catch(err => {
		        showNotify('Ошибка', 'при попытке получить список обращений', 'error');
		        console.warn('Ошибка при попытке получить список обращений', err)
		    })
		},

		/* 
			Получаем массив коментариев по id обращения
			Get comments list by helpdesk ID
		*/
		getComments({ getters, commit }, id) {

		    if (!id) {
	        	return;
		    }
			
			
			// Создаем токен отмены для отслеживания запроса
			// Creating cancel token for request monitoring
		    const source = CancelToken.source();
		    commit('addProcessingRequest', { name: 'getComments', token: source });
	
		    axios.get(`${HELPDESK_HOST}/v1/comments/`, {
		    	cancelToken: source.token,
		        headers: {Authorization: `bearer ${getters.jwt}`},
		        params: {
		            ticket_id: id,
		        },
		    }).then(res => {
		        commit('setCommits', res.data.data.comments)		        
		    }).catch(err => {
		    	if (axios.isCancel(err)) {

				} else {
					showNotify('Ошибка', 'при попытке получить список комментариев', 'error');
					console.warn('Ошибка при попытке получить список комментариев', err) 
				}
		    });
		},

		/* 
			Меняем статус непрочитанного тикета на прочитанный
			change current ticket status to is_readed=true 
		*/
		readTicket({ getters }, ticketId) {
		    axios.post(`${HELPDESK_HOST}/v1/ticket/touch`, {
		        id: ticketId
		    }, {
		        headers: {Authorization: `bearer ${getters.jwt}`},
		    }).catch(err => {
		        showNotify('Ошибка', 'при попытке открыть чат', 'error');
		        console.warn('Ошибка при попытке открыть чат', err)
		    });
		},

		/* 	
			Лонгпул метод для отслеживания изменений в редмайне
			Monitoring redmine changes by longpoll ticket request 
		*/
		helpdeskLongpool({state, commit, dispatch, getters}) {

		    axios.get(`${ HELPDESK_HOST }/v1/tickets/polling`, {
		        headers: {Authorization: `bearer ${getters.jwt}`},
		    }).then(res => {
		        if (res.status === 200) {
		            commit('setTickets', res.data.data.tickets)

					// Если открыт экран чата, то лонгпулл обновляет список комментариев
					// If chat screen is active refresh comment list
		            if(getters.activeTicketData) {
		            	dispatch('getComments', getters.activeTicketData.id);
		            }

					// Вновь запускаем лонгпул
					// Init longpoot again
		            dispatch('helpdeskLongpool');
		        }
		    }).catch(err => {
            
				// Вновь запускаем лонгпул
				// Init longpoot again
		        setTimeout(function () {
		            dispatch('helpdeskLongpool');
		        }, 30000);
		    })
		},

		/* 
			Отправляем ссылку в api для получения id ссылки. Это нужно, чтобы каждая ссылка была уникальна в микросервисе
			Send image link and get id from helpdesk micriservice. It makes links unic
		*/
		uploadFileToHelpdesk({ getters }, { link, type }) {
		    return axios.post(`${HELPDESK_HOST}/v1/link`, {
		        link: link,
		        type: type
		    }, {
		        headers: {Authorization: `bearer ${getters.jwt}`},
		    })
		},

		/* 
			Отправляем данные нового обращения в микросервис
			Send new ticket data to helpdesk microservice 
		*/
		sendNewTicket({state, commit, dispatch, getters}, { files, formData }) {

			
			// Активируем состояние загрузки для отображения лоадера
			// Loader indication init
			commit('setCreateTicketLoading', true);

			// Запускаем цикл загрузки ссылок в микросервис
			// Init upload link queue into microservice
			axios.all(files.map(item => dispatch('uploadFileToHelpdesk', { link: item.link, type: 'image' })))
			    .then(axios.spread((...args) => {
			        args.forEach((item, i) => {
			            if (item.status === 200 || item.status === 201) {
			                formData.append(`links[${i}]`, item.data.data.id)
			            }
			        })
					
					// Запускаем отправку сформированных данных нового обращения
					// Init send new ticket data
			        axios.post(`${HELPDESK_HOST}/v1/ticket`, formData, {
			            headers: {Authorization: `bearer ${getters.jwt}`, 'Content-Type': 'multipart/form-data'},
			        }).then(res => {
			            if (res.status === 200 || res.status === 201) {

			                showNotify('Обращение было создано', '', 'success');

		                	// Скрываем индикатор загрузки
		                	// Hide loading
			                commit('setCreateTicketLoading', false);

							// Обнуляем поля формы
							// Reset form
			                commit('resetNewTicketForm');
			            }
			        }).catch(err => {
		        	 
		        		// Скрываем индикатор загрузки
		        		// Hide loading
			            commit('setCreateTicketLoading', false);

			            showNotify('Ошибка', 'при попытке создать новое обращение', 'error');
			            console.warn('Ошибка при попытке создать новое обращение', err)
			        })

			    }))
			    .catch(err => {
			    	// Скрываем индикатор загрузки
	        		// Hide loading
			        commit('setCreateTicketLoading', false);

			        showNotify('Ошибка', 'при попытке загрузки изображения в микросервис Helpdesk', 'error');
			        console.warn('Ошибка при попытке загрузки изображения в микросервис Helpdesk', err)
			    })
		},

		/* 
			Отпавляем новый комментарий в микросервис
			Send comment data to helpdesk microservice 
		*/
		sendNewComment({state, commit, dispatch, getters}, { files, formData }) {

			// Активируем состояние загрузки для отображения лоадера
			// Loader indication init
			commit('setCreateCommentLoading', true);
			
			// Запускаем цикл загрузки ссылок в микросервис
			// Init upload link queue into microservice
			axios.all(files.map(item => dispatch('uploadFileToHelpdesk', { link: item.link, type: 'image' })))
			    .then(axios.spread((...args) => {
			        args.forEach((item, i) => {
			            if (item.status === 200 || item.status === 201) {
			                formData.append(`links[${i}]`, item.data.data.id)
			            }
			        })
					
					// Запускаем отправку сформированных данных нового коммнетария
					// Init send new comment data
			        axios.post(`${HELPDESK_HOST}/v1/comment`,
			            formData,
			            {
			                headers: {Authorization: `bearer ${getters.jwt}`, 'Content-Type': 'multipart/form-data'},
			            }
			        ).then(res => {

			        	// Обновляем список комментариев
			        	// Refresh comments list
	                    dispatch('getComments', getters.activeTicketData.id);

        		    	// Скрываем индикатор загрузки
                		// Hide loading
	                    commit('setCreateCommentLoading', false);

	                    // Очищаем форму комментария
        				// Clear comment form
	                    commit('resetChatForm');

	                    showNotify('Сообщение отправлено', '', 'success');
	                }).catch(err => {
	                	// Скрываем индикатор загрузки
                		// Hide loading
	                    commit('setCreateCommentLoading', false);

	                    showNotify('Ошибка', 'при попытке отправить сообщение', 'error');
	                    console.warn('Ошибка при попытке отправить сообщение', err)
	                })

			    }))
			    .catch(err => {

			    	// Скрываем индикатор загрузки
	        		// Hide loading
			    	commit('setCreateCommentLoading', false);
					
					// Если запрос был отменен
					// If request cancelled
	    	    	if (axios.isCancel(err)) {
						
	    			} else {
	    				showNotify('Ошибка', 'при попытке загрузки изображения в микросервис Helpdesk', 'error');
	    				console.warn('Ошибка при попытке загрузки изображения в микросервис Helpdesk', err)
	    			}
			        
			    })
		},
	},

	mutations: {
		setTickets(state, tickets) {
			state.tickets = tickets;
		},

		setActiveTicketData(state, ticketsData) {
			state.activeTicketData = ticketsData;
		},

		setCommits(state, comments) {
			state.comments = comments;
		},

		addProcessingRequest(state, {name, token}) {
			state.axiosLoadingRequests[name] = token
		},

		updateNewTicketMessage(state, message) {
			state.ticketTextArea.message = message
		},

		updateNewTicketTopic(state, topic) {
			state.ticketTextArea.topic = topic
		},

		setCreateTicketLoading(state, status) {
			state.ticketTextArea.isLoading = status;
		},

		setCreateCommentLoading(state, status) {
			state.messageTextArea.isLoading = status;
		},

		setCategoryData(state, data) {
			state.ticketTextArea.categoryData = data
		},

		setSubCategoriesData(state, data) {
			state.ticketTextArea.subCategoriesData = data
		},

		openTicketChat(state, ticketData) {
			state.activeTicketData = ticketData;
			state.comments = null;
		},
		
		/*
			Когда закрваем экран с чатом отменяем запрос загрузки списка комментариев 
			и очищаем state
			When close chat screen cancell request pending and clear state
		*/
		closeTicketChat(state) {
			Object.keys(state.axiosLoadingRequests).forEach((item) => {
				let request = state.axiosLoadingRequests[item];
				if(request) {
					request.cancel()
				}
			})
			state.activeTicketData = null;
			state.comments = null;
			state.messageTextArea.newTicketMessage = '';
			state.messageTextArea.files = [];
			state.messageTextArea.disabled = false;
			state.messageTextArea.isLoading = false;
		},

		updateTicketMessage(state, message) {
			state.messageTextArea.newTicketMessage = message;
		},

		/* Attach quote to message editor */
		addQuote(state, quote) {
		    state.messageTextArea.quote = quote;
		},

		/* Remove quote from message editor */
		removeQuote(state) {
		    state.messageTextArea.quote = null;
		},
		
		resetNewTicketForm(state) {
			state.ticketTextArea.categoryData = null;
			state.ticketTextArea.subCategoriesData = null;
			state.ticketTextArea.files = [];
			state.ticketTextArea.message = null;
			state.ticketTextArea.topic = null;
			state.ticketTextArea.isLoading = false;
		},

		resetChatForm(state) {
			state.messageTextArea.newTicketMessage = '';
			state.messageTextArea.files = [];
			state.messageTextArea.disabled = false;
			state.messageTextArea.isLoading = false;
			state.messageTextArea.quote = null;
		},
	},

	getters: {
		jwt(state, getters, rootState) {
			return rootState.common.JWT;
		},
		tickets(state) {
			return state.tickets;
		},
		activeTicketData(state) {
			return state.activeTicketData;
		},
		comments(state) {
			return state.comments;
		},
		messageTextArea(state) {
			return state.messageTextArea;
		},
		ticketTextArea(state) {
			return state.ticketTextArea;
		},
	},
} 