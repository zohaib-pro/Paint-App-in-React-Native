export class DateHandler {

    constructor(millis) {
        if (millis)
            this.datetime = millis
        else
            this.datetime = new Date().getTime();
    }

    getMillis() {
        return this.datetime
    }

    getFormatedDateTime() {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',

        }).format(new Date(this.datetime));

    }
}