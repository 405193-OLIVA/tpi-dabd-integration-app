import {
  Component,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { InfractionClaimListComponent } from '../../../infraction/components/infraction-claim-list/infraction-claim-list.component';
import {
  InfractionDto,
  InfractionModel,
} from '../../../infraction/models/infraction.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MainContainerComponent, TableColumn, TableComponent } from 'ngx-dabd-grupo01';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fine-infractions-list',
  standalone: true,
  imports: [TableComponent, DatePipe,MainContainerComponent],
  templateUrl: './fine-infractions-list.component.html',
  styleUrl: './fine-infractions-list.component.scss',
})
export class FineInfractionsListComponent {
  private router = inject(Router);

  @Input() infractions: InfractionModel[] = [];

  columns: TableColumn[] = [];
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  @ViewChild('date') dateTemplate!: TemplateRef<any>;
  @ViewChild('infoModal') infoModal!: TemplateRef<any>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        {
          headerName: 'N.° Infracción',
          accessorKey: 'id',
        },

        {
          headerName: 'Fecha',
          accessorKey: 'sanction_type.name',
          cellRenderer: this.dateTemplate,
        },

        {
          headerName: 'Descripción',
          accessorKey: 'description',
        },
        {
          headerName: 'Acciones',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  goToInfractionDetail(infractionId: number) {
    this.router.navigate(['penalties/infraction', infractionId]);
  }
  constructor(private modalService: NgbModal) { }

  onInfoButtonClick() {
    this.modalService.open(this.infoModal, { size: 'lg' });
  }
}
