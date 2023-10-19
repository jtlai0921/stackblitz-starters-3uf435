export class DatepickerPopOptions {
    date?: string | Date;
    min?: string; // 最小日
    max?: string; // 最大日
    timeType?: string;

    constructor() {
        this.date = new Date();
        this.min = '';
        this.max = '';
        this.timeType = '';
    }
}
