import type { Meta, StoryObj } from "@storybook/vue3";
import Badge from "../components/Badge.vue";
import Banner from "../components/Banner.vue";
import Button from "../components/Button.vue";
import ButtonGroup from "../components/ButtonGroup.vue";
import Card from "../components/Card.vue";
import Divider from "../components/Divider.vue";
import DropdownMenu from "../components/DropdownMenu.vue";
import ErrorCard from "../components/ErrorCard.vue";
import Input from "../components/Input.vue";
import Led from "../components/Led.vue";
import Loader from "../components/Loader.vue";
import Panel from "../components/Panel.vue";
import Progress from "../components/Progress.vue";
import Resizable from "../components/Resizable.vue";
import Select from "../components/Select.vue";
import Textarea from "../components/Textarea.vue";

const meta = {
  title: "Primitives",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BadgeStory: Story = {
  name: "Badge",
  render: () => ({
    components: { Badge, Progress },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem; width:min(56rem, 100%);">
        <Badge label="Badge" />
        <Badge label="full width" :full-width="true" />

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">SIZES</h3>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <Badge label="SM" color="secondary" size="sm" />
          <Badge label="MD" color="secondary" size="md" />
          <Badge label="LG" color="secondary" size="lg" />
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">ROUNDED</h3>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <Badge label="Size (matches size prop)" color="secondary" rounded="size" />
          <Badge label="SM" color="secondary" rounded="sm" />
          <Badge label="MD" color="secondary" rounded="md" />
          <Badge label="LG" color="secondary" rounded="lg" />
          <Badge label="Full" color="secondary" rounded="full" />
          <Badge label="None" color="secondary" rounded="none" />
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">COLORS</h3>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <Badge label="Primary" color="primary" />
          <Badge label="Secondary" color="secondary" />
          <Badge label="Destructive" color="destructive" />
          <Badge label="Warning" color="warning" />
          <Badge label="Active" color="active" />
          <Badge label="Inactive" color="inactive" />
          <Badge label="Agent" color="agent" />
          <Badge label="Client" color="client" />
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <Badge label="Primary" color="primary" variant="filled" />
          <Badge label="Secondary" color="secondary" variant="filled" />
          <Badge label="Destructive" color="destructive" variant="filled" />
          <Badge label="Warning" color="warning" variant="filled" />
          <Badge label="Active" color="active" variant="filled" />
          <Badge label="Inactive" color="inactive" variant="filled" />
          <Badge label="Agent" color="agent" variant="filled" />
          <Badge label="Client" color="client" variant="filled" />
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <Badge label="Primary" color="primary" variant="outline" />
          <Badge label="Secondary" color="secondary" variant="outline" />
          <Badge label="Destructive" color="destructive" variant="outline" />
          <Badge label="Warning" color="warning" variant="outline" />
          <Badge label="Active" color="active" variant="outline" />
          <Badge label="Inactive" color="inactive" variant="outline" />
          <Badge label="Agent" color="agent" variant="outline" />
          <Badge label="Client" color="client" variant="outline" />
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">WITH PROGRESS AND ICON</h3>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <Badge color="secondary">
            <span style="width:1.4rem;"><Progress :value="50" /></span>
            Badge with progress
          </Badge>
          <Badge color="secondary">
            <span aria-hidden="true">⚠</span>
            Badge with icon
          </Badge>
        </div>
      </div>
    `,
  }),
};

export const BannerStory: Story = {
  name: "Banner",
  render: () => ({
    components: { Banner },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.6rem; width:min(42rem, 100%);">
        <Banner title="Info banner" description="Informational message for users." variant="info" />
        <Banner title="Success banner" description="Everything is working as expected." variant="success" />
        <Banner title="Warning banner" description="Configuration may be incomplete." variant="warning" />
        <Banner title="Error banner" description="Unable to fetch the latest session data." variant="error" />
      </div>
    `,
  }),
};

export const ButtonStory: Story = {
  name: "Button",
  render: () => ({
    components: { Button },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem; width:min(56rem, 100%);">
        <section style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button label="Normal Button" />
        </section>
        <Button label="Full Width Button" :is-full-width="true" />

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">SIZES</h3>
        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button label="SM" size="sm" />
          <Button label="MD" size="md" />
          <Button label="LG" size="lg" />
          <Button label="XL" size="xl" />
        </div>

        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button size="sm"><span aria-hidden="true">⚠</span>SM With Icon</Button>
          <Button size="md"><span aria-hidden="true">⚠</span>MD With Icon</Button>
          <Button size="lg"><span aria-hidden="true">⚠</span>LG With Icon</Button>
          <Button size="xl"><span aria-hidden="true">⚠</span>XL With Icon</Button>
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">WITH ICON</h3>
        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button size="sm"><span aria-hidden="true">⌘</span>SM</Button>
          <Button size="md"><span aria-hidden="true">⌘</span>MD</Button>
          <Button size="lg"><span aria-hidden="true">⌘</span>LG</Button>
          <Button size="xl"><span aria-hidden="true">⌘</span>XL</Button>
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">ICON SIZING</h3>
        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button size="sm" :is-icon="true"><span aria-hidden="true">⌘</span></Button>
          <Button size="md" :is-icon="true"><span aria-hidden="true">⌘</span></Button>
          <Button size="lg" :is-icon="true"><span aria-hidden="true">⌘</span></Button>
          <Button size="xl" :is-icon="true"><span aria-hidden="true">⌘</span></Button>
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">ROUNDED</h3>
        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button rounded="size">Size (matches size prop)</Button>
          <Button rounded="sm">SM</Button>
          <Button rounded="lg">LG</Button>
          <Button rounded="xl">XL</Button>
          <Button rounded="full">Full</Button>
          <Button rounded="none">None</Button>
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">VARIANT</h3>
        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="active">Active</Button>
          <Button variant="inactive">Inactive</Button>
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">LOADER</h3>
        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button loader="icon" :is-loading="true">Icon</Button>
          <Button loader="stripes" :is-loading="true">Stripes</Button>
          <Button loader="stripes" :is-loading="true" variant="secondary">Stripes</Button>
          <Button loader="stripes" :is-loading="true" variant="outline">Stripes</Button>
          <Button loader="stripes" :is-loading="true" variant="destructive">Stripes</Button>
          <Button loader="stripes" :is-loading="true" variant="active">Stripes</Button>
          <Button loader="stripes" :is-loading="true" variant="inactive">Stripes</Button>
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">STATE</h3>
        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button variant="primary" state="default">Primary / Default</Button>
          <Button variant="primary" state="inactive">Primary / Inactive</Button>
          <Button variant="primary" state="active">Primary / Active</Button>
          <Button variant="outline" state="active">Outline / Active</Button>
          <Button variant="outline" state="inactive">Outline / Inactive</Button>
        </div>

        <h3 style="font-size:0.95rem; margin:0; border-top:1px solid #e5e7eb; padding-top:0.7rem;">DISABLED + UPPERCASE</h3>
        <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
          <Button :disabled="true">Disabled</Button>
          <Button :uppercase="true">Uppercase</Button>
        </div>
      </div>
    `,
  }),
};

export const ButtonGroupStory: Story = {
  name: "Button group",
  render: () => ({
    components: { ButtonGroup, Button },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.8rem;">
        <ButtonGroup>
          <Button label="One" />
          <Button label="Two" variant="secondary" />
          <Button label="Three" variant="outline" />
        </ButtonGroup>
        <ButtonGroup :vertical="true">
          <Button label="Vertical A" size="sm" />
          <Button label="Vertical B" size="sm" variant="secondary" />
        </ButtonGroup>
      </div>
    `,
  }),
};

export const CardStory: Story = {
  name: "Card",
  render: () => ({
    components: { Card },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(15rem, 1fr)); gap:0.75rem; width:min(44rem,100%);">
        <Card title="Card title" subtitle="Subtitle">Card content</Card>
        <Card title="Another card">With only title and body</Card>
        <Card>Body-only card</Card>
      </div>
    `,
  }),
};

export const DividerStory: Story = {
  name: "Divider",
  render: () => ({
    components: { Divider },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.7rem; width:20rem;">
        <span style="font-size:0.8rem;">Horizontal divider</span>
        <Divider />
        <div style="display:flex; align-items:center; gap:0.55rem;">
          <span style="font-size:0.8rem;">A</span>
          <Divider orientation="vertical" />
          <span style="font-size:0.8rem;">B</span>
        </div>
      </div>
    `,
  }),
};

export const DropdownMenuStory: Story = {
  name: "Dropdown menu",
  render: () => ({
    components: { DropdownMenu },
    template: `
      <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
        <DropdownMenu label="Open menu" :items="['Profile', 'Settings', 'Sign out']" />
        <DropdownMenu label="Actions" :items="['Mute', 'Disable camera', 'Disconnect']" />
      </div>
    `,
  }),
};

export const ErrorCardStory: Story = {
  name: "Error card",
  render: () => ({
    components: { ErrorCard },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.7rem;">
        <ErrorCard title="Something went wrong">Unable to complete operation.</ErrorCard>
        <ErrorCard title="Connection error" size="sm" shadow="short">Transport not ready.</ErrorCard>
        <ErrorCard title="Critical failure" size="lg" shadow="xlong">The agent process terminated unexpectedly.</ErrorCard>
      </div>
    `,
  }),
};

export const InputStory: Story = {
  name: "Input",
  render: () => ({
    components: { Input },
    data() {
      return { valueA: "", valueB: "Prefilled value" };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.6rem; width:20rem;">
        <Input v-model="valueA" placeholder="Type your name" />
        <Input v-model="valueB" />
        <Input model-value="Disabled input" :disabled="true" />
      </div>
    `,
  }),
};

export const LedStory: Story = {
  name: "Led",
  render: () => ({
    components: { Led },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.7rem;">
        <div style="display:flex; gap:0.55rem; align-items:center;">
          <Led color="green" />
          <Led color="yellow" />
          <Led color="red" />
          <Led color="red" state="off" />
        </div>
        <div style="display:flex; gap:0.55rem; align-items:center;">
          <Led color="green" size="sm" :pulse="true" />
          <Led color="yellow" size="md" :pulse="true" />
          <Led color="red" size="lg" :pulse="true" />
        </div>
      </div>
    `,
  }),
};

export const LoaderStory: Story = {
  name: "Loader",
  render: () => ({
    components: { Loader },
    template: `
      <div style="display:flex; gap:0.7rem; align-items:center;">
        <Loader size="sm" />
        <Loader size="md" />
        <Loader size="lg" />
      </div>
    `,
  }),
};

export const PanelStory: Story = {
  name: "Panel",
  render: () => ({
    components: { Panel },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(16rem, 1fr)); gap:0.75rem; width:min(44rem,100%);">
        <Panel title="Panel" subtitle="Status">Panel content</Panel>
        <Panel title="Session" subtitle="Info">Participant ID: 2fca...</Panel>
      </div>
    `,
  }),
};

export const ProgressStory: Story = {
  name: "Progress",
  render: () => ({
    components: { Progress },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.6rem; width:20rem;">
        <Progress :value="20" />
        <Progress :value="45" />
        <Progress :value="75" />
        <Progress :value="100" />
      </div>
    `,
  }),
};

export const ResizableStory: Story = {
  name: "Resizable",
  render: () => ({
    components: { Resizable },
    template: `
      <div style="display:flex; gap:0.8rem; flex-wrap:wrap;">
        <Resizable direction="both" style="width:14rem; height:5rem;">Both</Resizable>
        <Resizable direction="horizontal" style="width:14rem; height:5rem;">Horizontal</Resizable>
        <Resizable direction="vertical" style="width:14rem; height:5rem;">Vertical</Resizable>
      </div>
    `,
  }),
};

export const SelectStory: Story = {
  name: "Select",
  render: () => ({
    components: { Select },
    data() {
      return { selected: "" };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.6rem; width:14rem;">
        <Select v-model="selected" :options="[{label:'Option A', value:'a'}, {label:'Option B', value:'b'}]" />
        <small style="color:#6b7280;">Selected: {{ selected || "none" }}</small>
      </div>
    `,
  }),
};

export const TextareaStory: Story = {
  name: "Textarea",
  render: () => ({
    components: { Textarea },
    data() {
      return { longText: "This is a larger textarea example with preset text." };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:0.6rem; width:24rem;">
        <Textarea :rows="3" placeholder="Short note..." />
        <Textarea v-model="longText" :rows="5" />
      </div>
    `,
  }),
};
