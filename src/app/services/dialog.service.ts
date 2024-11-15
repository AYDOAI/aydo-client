import {
	ViewContainerRef,
	Injector,
	Injectable,
	Type,
	ComponentRef,
	ComponentFactoryResolver,
	Renderer2,
	RendererFactory2,
} from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { BaseDialogComponent } from "../elements/dialog/base-dialog";

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	public activeInstances: number;
	private viewContainerRef: ViewContainerRef = {} as ViewContainerRef;
	private activeInstances$: Subject<number> = new Subject();
	private modalRef: ComponentRef<any>[] = [];
	private renderer: Renderer2;

	constructor(private resolver: ComponentFactoryResolver, private rendererFactory: RendererFactory2) {
		this.activeInstances = 0;
		this.renderer = this.rendererFactory.createRenderer(null, null);
	}

	public registerViewContainerRef(vcRef: ViewContainerRef): void {
		this.viewContainerRef = vcRef;
	}

  public show<T extends BaseDialogComponent>(component: Type<T>, parameters?: any): Observable<ComponentRef<T>> {
    console.log('show');
    const componentRef$ = new ReplaySubject<ComponentRef<T>>(1);

    const injector = Injector.create({
      providers: [],
      parent: this.viewContainerRef.injector,
    });

    const factory = this.resolver.resolveComponentFactory(component);
    const componentRef = factory.create(injector);

    this.viewContainerRef.insert(componentRef.hostView);

    Object.assign(componentRef.instance as T, parameters as Partial<T>);

    this.activeInstances++;
    this.activeInstances$.next(this.activeInstances);

    const instance = componentRef.instance as T;

    (instance['componentIndex'] as number) = this.activeInstances;

    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    (instance['destroy'] as () => void) = (): void => {
      if (instance['componentIndex'] === this.activeInstances) {
        this.activeInstances = Math.max(this.activeInstances - 1, 0);

        const idx = this.modalRef.indexOf(componentRef);
        if (idx > -1) {
          this.modalRef.splice(idx, 1);
        }

        this.activeInstances$.next(this.activeInstances);
        componentRef.destroy();

        if (this.activeInstances < 1) {
          this.renderer.removeStyle(document.body, 'overflow');
        }
      }
    };

    this.modalRef.push(componentRef);
    componentRef$.next(componentRef);
    componentRef$.complete();

    return componentRef$.asObservable();
  }
}
