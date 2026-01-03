import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MaterialModule } from '@shared/material/material.module';

export interface ActivityItem {
    readonly id: number;
    readonly icon: string;
    readonly iconColor: string;
    readonly title: string;
    readonly description: string;
    readonly time: string;
}

@Component({
    selector: 'app-activity-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MaterialModule],
    templateUrl: './activity-list.html',
    styleUrl: './activity-list.scss',
})
export class ActivityListComponent {
    readonly activities = input.required<ActivityItem[]>();
}
