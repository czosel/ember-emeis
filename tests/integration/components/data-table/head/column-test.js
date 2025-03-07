import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | data-table/head/column", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (assert) {
    this.set("sort", "last_name");
    this.set("update", (sort) => {
      this.set("sort", sort);
      assert.step("update");
    });
  });

  test("it renders", async function (assert) {
    await render(hbs`
        <DataTable::Head @sortedBy={{this.sort}} @update={{this.update}} as |Column|>
          <Column @sort={{this.sort}}>
            test
          </Column>
        </DataTable::Head>
      `);

    assert.dom(this.element).hasText("test");
    assert.dom("span[icon=chevron-down]").exists();
  });

  test("it renders as block", async function (assert) {
    await render(hbs`
      <DataTable::Head::Column @update={{this.update}}>
        template block text
      </DataTable::Head::Column>
    `);

    assert.dom(this.element).hasText("template block text");
  });

  test("it toggles sort state", async function (assert) {
    await render(hbs`
        <DataTable::Head @sortedBy={{this.sort}} @update={{this.update}} as |Column|>
          <Column @sort={{"last_name"}}>
            one
          </Column>
          <Column @sort={{"first_name"}}>
            two
          </Column>
        </DataTable::Head>
      `);

    assert.dom("[data-test-sortable-th=last_name]").hasText("one");
    assert.dom("[data-test-sortable-th=first_name]").hasText("two");
    assert
      .dom("[data-test-sortable-th=last_name] span[icon=chevron-down]")
      .exists();

    this.set("sort", "first_name");

    assert
      .dom("[data-test-sortable-th=last_name] span[icon=chevron-down]")
      .doesNotExist();
    assert
      .dom("[data-test-sortable-th=first_name] span[icon=chevron-down]")
      .exists();

    await click("[data-test-sortable-th=last_name]");

    assert.verifySteps(["update"]);

    assert
      .dom("[data-test-sortable-th=first_name] span[icon=chevron-down]")
      .doesNotExist();
    assert
      .dom("[data-test-sortable-th=last_name] span[icon=chevron-down]")
      .exists();

    this.set("sort", "-last_name");

    assert
      .dom("[data-test-sortable-th=last_name] span[icon=chevron-up]")
      .exists();
  });
});
