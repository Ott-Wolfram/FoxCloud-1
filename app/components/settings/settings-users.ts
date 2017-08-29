import { IAngularStatic } from "angular";
import { USER_SERVICE_TOKEN, UserService } from "../../services/user-service";
import { User } from "../../types/object/user";
import { toResolvableArray } from "../../utils/resolvable";

declare const angular: IAngularStatic;

/**
 * Token used for Angular's dependency injection of the settings/users component.
 * This corresponds to the "Angular name" for this component.
 */
export const SETTINGS_USERS_TOKEN: string = "fcaSettingsUsers";

/**
 * The state of the list item for a given user.
 */
interface ListItem {
  readonly user: User;
  isSelected: boolean;
}

/**
 * @class SettingsUsers
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages users settings
 * require administrator rights
 */
angular.module("FSCounterAggregatorApp").component(SETTINGS_USERS_TOKEN, {
  templateUrl: "build/html/settings-users.html",
  controller: [
    USER_SERVICE_TOKEN,
    "DTOptionsBuilder",
    "DTColumnDefBuilder",
    class {
      /**
       * Boolean indicating if all the elements are selected, even those on the other pages.
       * @readonly
       */
      isAllSelected: boolean;

      /**
       * Count of selected items.
       * @readonly
       */
      selectedCount: number;

      /**
       * List of user with state data (selection state).
       * @readonly
       */
      userList: ListItem[];

      /**
       * Options for  `angular-datatables`.
       */
      dtOptions: any;

      /**
       * Options for `angular-datatables`.
       */
      dtColumnDefs: any;

      private userService: UserService;

      /* tslint:disable-next-line:variable-name */
      constructor(userService: UserService, DTOptionsBuilder: any, DTColumnDefBuilder: any,) {
        this.userService = userService;

        this.isAllSelected = false;
        this.selectedCount = 0;

        this.dtOptions = DTOptionsBuilder.newOptions()
          .withOption("order", [[1, "asc"]])
          .withBootstrap();

        this.dtColumnDefs = [
          DTColumnDefBuilder.newColumnDef(0).notSortable(),
          DTColumnDefBuilder.newColumnDef(1),
          DTColumnDefBuilder.newColumnDef(2),
          DTColumnDefBuilder.newColumnDef(3),
          DTColumnDefBuilder.newColumnDef(4),
          DTColumnDefBuilder.newColumnDef(5).notSortable(),
        ];

        this.userList = toResolvableArray(userService.getUsers()
          .then((users: User[]): ListItem[] => {
            const result: ListItem[] = [];
            for (const user of users) {
              result.push({user, isSelected: false});
            }
            return result;
          }),
        );
      }

      /**
       * Handles the user action of toggling the `isAllSelected` checkbox.
       */
      handleIsAllSelectedChange(): void {
        for (const item of this.userList) {
          item.isSelected = this.isAllSelected;
        }
        this.selectedCount = this.isAllSelected ? this.userList.length : 0;
      }

      /**
       * Handles the user action of toggling the `isSelected` checkbox for an item.
       */
      handleItemIsSelectedChange(): void {
        this.selectedCount = 0;
        for (const item of this.userList) {
          if (item.isSelected) {
            this.selectedCount++;
          }
        }
        this.isAllSelected = this.selectedCount === this.userList.length;
      }
    },
  ],
});
