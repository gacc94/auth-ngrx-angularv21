import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    exports: [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatMenuModule,
        MatButtonToggleModule,
    ],
})
export class MaterialModule {}
