import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '@shared/material/material.imports';

@Component({
    selector: 'app-revenue-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [...MATERIAL_IMPORTS],
    templateUrl: './revenue-chart.html',
    styleUrl: './revenue-chart.scss',
})
export class RevenueChartComponent {}
