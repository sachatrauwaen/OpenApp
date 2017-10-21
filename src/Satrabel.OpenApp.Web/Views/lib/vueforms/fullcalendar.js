(function () {
    var calendar = {
        name: "calendar",
        template: '<div></div>',
        props: {
            resources:{}
        },
        data: function () {
            var self = this;
            return {
                
            };
        },
        computed: {
            
        },
        methods: {
            option: function (name, value) {
                $(this.$el).fullCalendar('option', name, value);
            } 
        },
        watch: {
            'resources': function () {
                this.option('resources', this.resources);
            }
        },
        mounted() {
            let options = {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                //slotDuration :'01:00:00',
                defaultView: 'agendaDay',
                //defaultDate: '2017-09-07',
                editable: true,
                selectable: true,
                eventLimit: true, // allow "more" link when too many events
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'agendaDay,agendaWeek,month'
                },
                views: {
                    agendaTwoDay: {
                        type: 'agenda',
                        duration: { days: 2 },

                        // views that are more than a day will NOT do this behavior by default
                        // so, we need to explicitly enable it
                        groupByResource: true

                        //// uncomment this line to group by day FIRST with resources underneath
                        //groupByDateAndResource: true
                    }
                },
			    allDaySlot: false,
                timezone: 'local',
                locale: 'fr',
                customButtons: {
                    addButton: {
                        text: 'Ajouter un job',
                        click: function () {
                            //alert('clicked the custom button!');
                            window.location.href = "/jobs#/events/add";
                        }
                    }
                },
                resources: this.resources,
                resources: function (callback) {
                    vm.$emit('resources', callback);
                },
                editable: false,
                height: $(window).height() - 220,
                events: function (start, end, timezone, callback) {
                    vm.$emit('events', start, end, timezone, callback);
                },
                /*
                eventRender: function (event, element) {
                    if (event.description){
                        //$(element).tooltip({ title: event.description });
                    }
                },
                */
                eventRender: function (event, element) {

                    let dateformat = "DD/MM/YYYY";

                    let start = event.start.format(dateformat);
                    let end = '';
                    if (event.end) {
                        start = event.start.format(dateformat);
                        end = event.end.format(dateformat);
                        if (event.allDay) {
                            end = event.end.clone().add(-1, 'day').format(dateformat);
                        }
                    }

                    let place = '';
                    if (event.location) {
                        place = " - " + event.location;
                    }
                    let placement = 'right';
                    if (event.start.day() === 0) {
                        placement = 'left';
                    }
                    element.text(event.title + place + " - " + start + (start == end ? '' : ' - ' + end));

                },
                
                eventClick: function (calEvent, jsEvent, view) {
                    //alert('Event: ' + calEvent.title);
                    //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                    //alert('View: ' + view.name);
                    vm.$emit('eventclick', calEvent, jsEvent, view);
                },
                viewRender: function (view) {
                    $('.fc-addButton-button').html('<i class="fa fa-plus-circle" aria-hidden="true"></i>');
                },
                dayClick: function (date, jsEvent, view, resourceObj) {
                    //alert('Clicked on: ' + date.format());
                    vm.$emit('dayclick', date, jsEvent, view, resourceObj);
                }
            };

            let vm = this;
            $(this.$el)
                // init select2
                .fullCalendar(options);


            //.val(this.value)
            //.trigger('change')
            // emit event on change.
            //.on('change', function () {
            //vm.$emit('input', this.value)
            //})

        },

        destroyed() {
            //$(this.$el).off().fullCalendar('destroy');
        }
    }
    Vue.component('fullcalendar', calendar);
})();