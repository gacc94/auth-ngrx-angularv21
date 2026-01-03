import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@shared/material/material.module';

@Component({
    selector: 'app-revenue-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MaterialModule],
    templateUrl: './revenue-chart.html',
    styleUrl: './revenue-chart.scss',
})
export class RevenueChartComponent {}
