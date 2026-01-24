import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { MenuItem, MenuNode } from '..';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly path = `./menu.json`;

  http = inject(HttpClient);

  private data$ = this.http.get<any>(this.path).pipe(
    map((m) => {
      return this.buildMenuTree(m);
    }),
    shareReplay({
      bufferSize: 1,
      refCount: false,
    })
  );

  private buildMenuTree = (
    menuItems: MenuItem[],
    groupId?: string
  ): MenuNode[] => {
    const subnodes: MenuNode[] = [];

    for (const menuItem of menuItems) {
      if (menuItem.groupId === groupId) {
        const subnode: MenuNode = {
          menuItem,
          subnodes: this.buildMenuTree(menuItems, menuItem.ID),
        };
        subnodes.push(subnode);
      }
    }

    return subnodes;
  };

  /**
   * @description Get local menu items
   * @returns {Observable<any>}
   */
  get = (): Observable<any> => {
    return this.data$;
  };
}
