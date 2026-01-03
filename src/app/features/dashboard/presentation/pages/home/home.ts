import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthStore } from '@auth/application/stores/auth.store';
import { MaterialModule } from '@shared/material/material.module';
import { ActivityListComponent } from '../../components/activity-list/activity-list';
import { RevenueChartComponent } from '../../components/revenue-chart/revenue-chart';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { UpgradeBannerComponent } from '../../components/upgrade-banner/upgrade-banner';

export interface StatCard {
    readonly title: string;
    readonly value: string;
    readonly change: string;
    readonly changeType: 'positive' | 'negative';
    readonly icon: string;
    readonly iconBgColor: string;
}

export interface ActivityItem {
    readonly id: number;
    readonly icon: string;
    readonly iconColor: string;
    readonly title: string;
    readonly description: string;
    readonly time: string;
}

@Component({
    selector: 'app-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './home.html',
    styleUrl: './home.scss',
    imports: [MaterialModule, StatCardComponent, ActivityListComponent, RevenueChartComponent, UpgradeBannerComponent],
})
export default class Home {
    protected readonly authStore = inject(AuthStore);

    /** User display name for greeting */
    protected readonly userName = computed(() => {
        const user = this.authStore.user();
        return user?.name ?? user?.email?.split('@')[0] ?? 'User';
    });

    /** Statistics cards data */
    protected readonly statCards = signal<StatCard[]>([
        {
            title: 'Total Revenue',
            value: '$12,450',
            change: '+5% vs last month',
            changeType: 'positive',
            icon: 'trending_up',
            iconBgColor: '#3b82f6',
        },
        {
            title: 'New Customers',
            value: '342',
            change: '+12% vs last month',
            changeType: 'positive',
            icon: 'person',
            iconBgColor: '#10b981',
        },
        {
            title: 'Pending Tasks',
            value: '15',
            change: '-2% vs last month',
            changeType: 'negative',
            icon: 'assignment',
            iconBgColor: '#f59e0b',
        },
    ]);

    /** Recent activity items */
    protected readonly activityItems = signal<ActivityItem[]>([
        {
            id: 1,
            icon: 'edit_document',
            iconColor: '#3b82f6',
            title: 'Alice updated the roadmap',
            description: 'Project: Website Redesign',
            time: '2m ago',
        },
        {
            id: 2,
            icon: 'backup',
            iconColor: '#f59e0b',
            title: 'System backup completed',
            description: 'Database',
            time: '1h ago',
        },
        {
            id: 3,
            icon: 'person_add',
            iconColor: '#ef4444',
            title: 'New user registration',
            description: 'John Doe',
            time: '3h ago',
        },
        {
            id: 4,
            icon: 'check_circle',
            iconColor: '#10b981',
            title: 'Task resolved',
            description: 'Fix login bug',
            time: '5h ago',
        },
    ]);
}
