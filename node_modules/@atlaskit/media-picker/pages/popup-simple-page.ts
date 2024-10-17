import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { PopupUploadEventPayloadMap } from '../src/types';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { CardStatus } from '@atlaskit/media-card';

export type Event = {
  readonly name: string;
  readonly payload: any;
};

export type RecentUploadCard = {
  readonly filename: string;
  readonly status: string;
};

interface RecentCardFilter {
  status?: CardStatus;
  filename?: string;
}
/**
 * Popup Simple Example Page Object
 * @see https://www.seleniumhq.org/docs/06_test_design_considerations.jsp#page-object-design-pattern
 */
export class PopupSimplePage extends Page {
  async getRecentUploadCards(): Promise<RecentUploadCard[]> {
    const selector = '[data-testid="media-file-card-view"]';
    const result = await this.$$(selector);
    return Promise.all(
      result.map(async element => {
        const nameElement = await element.$(
          '[data-testid="media-card-file-name"]',
        );
        const filename = await nameElement.getHTML(false);
        const status = await element.getAttribute('data-test-status');
        const recentUploadCard: RecentUploadCard = {
          filename: filename,
          status,
        };
        return recentUploadCard;
      }),
    );
  }

  async getRecentUploadCard(
    filter: RecentCardFilter,
  ): Promise<RecentUploadCard | undefined> {
    const cardFilterPredicate = createCardFilterPredicate(filter);
    await this.waitUntil(async () => {
      const cards = await this.getRecentUploadCards();
      return cards.some(cardFilterPredicate);
    });
    return (await this.getRecentUploadCards()).find(cardFilterPredicate);
  }

  async clickInsertButton(): Promise<void> {
    await this.click('[data-testid="media-picker-insert-button"]');
  }

  async getEvents(): Promise<Event[]> {
    return JSON.parse(await this.getText('#events'));
  }

  async getEvent(name: keyof PopupUploadEventPayloadMap): Promise<Event> {
    await this.waitUntil(async () =>
      (await this.getEvents()).some(eventWithName(name)),
    );

    const events = await this.getEvents();

    const event = events.find(eventWithName(name));
    if (event) {
      return event;
    } else {
      throw new Error(`Event ${name} not found`);
    }
  }

  async uploadFile(localFilePath: string) {
    // Any is because there is a bug in webdriverio types in version 5.11.0
    // It is only fixed in 5.11.14, but that version introduces bigger problem.
    const filename: string = (await this.browser.uploadFile(
      localFilePath,
    )) as any;
    const fileInputSelector = '[data-testid="media-picker-file-input"]';
    await this.waitForSelector(fileInputSelector);

    // We want to make input visible in order to be able to "type" into it.
    await this.execute(() => {
      const element = document.querySelector<HTMLInputElement>(
        '[data-testid="media-picker-file-input"]',
      );
      if (element) {
        element.style.display = 'block';
        element.removeAttribute('multiple');
        element.value = '';
      }
    });
    const fileInput = await this.$(fileInputSelector);
    await fileInput.addValue(filename);

    await this.waitForSelector('[data-testid="media-picker-insert-button"]');
  }
}

export async function gotoPopupSimplePage(
  client: ConstructorParameters<typeof Page>[0],
): Promise<PopupSimplePage> {
  const page = new PopupSimplePage(client);
  const url = getExampleUrl('media', 'media-picker', 'popup-simple');
  await page.goto(url);
  await page.isVisible('[data-testid="media-picker-popup"]');
  return page;
}

function eventWithName(name: string) {
  return (event: Event) => event.name === name;
}

function createCardFilterPredicate(filter: RecentCardFilter) {
  return (card: RecentUploadCard) =>
    (filter.filename === undefined || card.filename === filter.filename) &&
    (filter.status === undefined || card.status === filter.status);
}
