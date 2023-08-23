<div align="center">
    <a href="./00_Index.md">Index</a>
    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="./02_CollectionTypes.md">Collection Types</a>
</div>

---

# 1. Value Objects

There are a few steps to take to edit your custom ValueObjects in Inspector Gadget.

> **Hint:** Value objects are used to encapsulate a certain discrete value.
> They are defined by this value and thus have no external identity ("identifier") but can rather be used as identifiers for e.g. entities.
> They are immutable, so they have no lifecycle, cannot contain mutables like entities and must enforce immutability of their internal values,
> that may be either primitives or other value objects.
> 
> An example for this might be a postal address; as soon as any of the internal values
> `streetAddress`, `postalCode`, `addressLocality` or `addressCountry` are changed,
> it becomes a different address and therefore should result in a new object.  

## 1.1 Create your value object

Your value object may reside anywhere in your codebase covered by composer and must implement
* \JsonSerializable
* a static ::from$Type constructor method matching their type

for serialization and deserialization.
A valid string based ValueObject might look like this:
```php
<?php
 
declare(strict_types=1);

namespace Vendor\Site\Domain;

/**
 * Tip:
 * It's highly recommended to declare ValueObjects as final
 * to keep them canonical.
 */
final readonly class ProductIdentifier implements \JsonSerializable
{
    private function __construct(
        public readonly string $value
    ) {
    }
    
    public static function fromString(string $string): self
    {
        return new self($string);
    }

    public function jsonSerialize(): string
    {
        return $this->value;
    }
}
```
while a valid array based ValueObject might look like this:
```php
<?php
 
declare(strict_types=1);

namespace Vendor\Site\Domain;

final readonly class PostalAddress implements \JsonSerializable
{
    private function __construct(
        public string $streetAddress,
        public string $postalCode,
        public string $addressLocality,
        public string $addressCountry
    ) {
    }
    
    /**
     * @param array<string,string> $array
     */
    public static function fromArray(array $array): self
    {
        return new self(
            $array['streetAddress'],
            $array['postalCode'],
            $array['addressLocality'],
            $array['addressCountry']
        );
    }

    /**
     * @return array<string,string>
     */
    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}
```

## 1.2 Use the value object in your NodeType

Value objects can be used in a node type just as simple types, dates etc.
Since they might have multiple properties though, we need a custom inspector editor.
That's where InspectorGadget comes into play:

```
'Vendor.Site:Document.LocalBusiness':
  superTypes:
    'Neos.Neos:Document': true
  ui:
    label: 'Local Business'
    icon: 'building'
    inspector:
      tabs:
        location:
          icon: 'location-dot'
      groups:
        location:
          tab: location
          label: 'Location'
          icon: 'location-dot'
  properties:
    address:
      type: 'Vendor\Site\Domain\PostalAddress'
      ui:
        label: 'Address'
        showInCreationDialog: true
        inspector:
          group: location
          editor: Sitegeist.InspectorGadget/Inspector/Editor
          editorOptions:
            isNullable: false
            labels:
              create: 'Create postal address'
      validation:
        'Neos.Neos/Validation/NotEmptyValidator': {}
```

## 1.3 Provide the inspector editor

Since value objects are usually tailored precisely to the domain's needs,
InspectorGadget does not provide a generic and configurable editor,
but rather the means to build your own.
This is done as follows:

### Write your react component

To properly handle our PostalAddress object in the UI, we build our own react component, composed of three parts:
1. a validator function
2. a preview component for the inspector itself
3. a form component to be rendered in the overlay after clicking the preview button

The result looks as follows:

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/src/Editors/PostalAddress/PostalAddress.tsx`*</small>
```tsx
import * as React from 'react';

export function* validator(postalAddress: any) {
    if (!postalAddress.streetAddress) {
        yield {
            field: 'streetAddress',
            message: 'Street Address is required'
        };
    }

	if (!postalAddress.postalCode) {
		yield {
			field: 'postalCode',
			message: 'Postal Code is required'
		};
	}

	if (!postalAddress.addressLocality) {
		yield {
			field: 'addressLocality',
			message: 'Address Locality is required'
		};
	}

	if (!postalAddress.addressCountry) {
		yield {
			field: 'addressCountry',
			message: 'Address Country is required'
		};
	}
}

export const Preview: React.FC<{
    value: any
    api: any
}> = props => {
    const {IconCard} = props.api;

	return (
		<IconCard
			icon="envelope"
			title={props.value.streetAddress}
			subTitle={`${props.value.postalCode} ${props.value.addressLocality} ${props.value.addressCountry}`}
		/>
	);
}

export const Form: React.FC<{
    api: any
}> = props => {
const {Field, Layout} = props.api;

	return (
		<Layout.Stack>
			<Field
				name="streetAddress"
				label="Street Address"
				editor="Neos.Neos/Inspector/Editors/TextFieldEditor"
			/>
			<Layout.Columns columns={2}>
				<Field
					name="postalCode"
					label="Postal Code"
					editor="Neos.Neos/Inspector/Editors/TextFieldEditor"
				/>
				<Field
					name="addressLocality"
					label="Address Locality"
					editor="Neos.Neos/Inspector/Editors/TextFieldEditor"
				/>
			</Layout.Columns> 
			<Field
				name="addressCountry"
				label="Address Address"
				editor="Neos.Neos/Inspector/Editors/TextFieldEditor"
			/>
		</Layout.Stack>
	);
}
```
InspectorGadget provides some components that you can use, like Layout.Stack or IconCard for the preview button.
In general, feel free to build this form any way you want, react's the limit!

Now you can export it:
<small>*`EXAMPLE: Vendor.Site/Neos.Ui/src/Editors/PostalAddress/index.tsx`*</small>
```ts
export * as PostalAddress from './PostalAddress';
```

... and delegate it from your central Editor index:

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/src/Editors/index.ts`*</small>
```ts
export {PostalAddress} from './PostalAddress';
```

### Write and declare your manifest

The manifest with the registered editor would look like this:

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/src/manifest.js`*</small>
```js
import manifest from '@neos-project/neos-ui-extensibility';

import {PostalAddress} from '../lib';

manifest('@vendor/site-editors', {}, (globalRegistry) => {
	const editorsRegistry = globalRegistry.get('@sitegeist/inspectorgadget/editors');

	editorsRegistry.set(
		'Vendor\\Site\\Domain\\PostalAddress',
		PostalAddress
	);
});
```

This way, it is defined that properties of type `Vendor\Site\Domain\PostalAddress` using our imported new PostalAddress editor.
Now we can include our manifest:

> **Hint:** This depends on your Neos version

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/src/index.js in Neos 8.0 and 8.1`*</small>
```js
require('./manifest');
```

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/src/index.js in Neos 8.2 and 8.3`*</small>
```js
require('./manifest');
import "regenerator-runtime/runtime";
```
and declare the necessary modules:

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/src/global.d.ts`*</small>
```ts
declare module '@neos-project/neos-ui-editors';
declare module '@neos-project/react-ui-components';
```

### Declare the plugin package:
The package declaration might differ depending on the build,
but we strongly recommend a typescript based one which might look as follows:

> **Hint:** This depends on your Neos version

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/package.json in Neos 8.0 / 8.1`*</small>
```json
{
    "name": "@vendor/site-editors",
    "private": true,
    "main": "index.js",
    "scripts": {
        "build": "rm -rf lib && tsc -p tsconfig.json && neos-react-scripts build",
        "watch": "tsc -w -p tsconfig.json & neos-react-scripts watch & wait"
    },
    "neos": {
        "buildTargetDirectory": "../Resources/Public/Neos.Ui"
    },
    "devDependencies": {
        "@neos-project/neos-ui-extensibility": "^8.1.0",
        "@neos-project/build-essentials": "^8.1.0",
        "@types/styled-components": "^5.1.9",
        "typescript": "^4.2.4"
    },
    "dependencies": {
        "@neos-project/react-ui-components": "^8.1.0",
        "array-move": "^3.0.1",
        "react-simple-timefield": "^3.2.3",
        "styled-components": "^5.3.0"
    }
}
```

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/package.json in Neos 8.2`*</small>
```json
{
    "name": "@vendor/site-editors",
    "private": true,
    "main": "index.js",
    "scripts": {
        "build": "rm -rf lib && tsc -p tsconfig.json && neos-react-scripts build",
        "watch": "tsc -w -p tsconfig.json & neos-react-scripts watch & wait"
    },
    "neos": {
        "buildTargetDirectory": "../Resources/Public/Neos.Ui"
    },
    "devDependencies": {
        "@neos-project/neos-ui-extensibility": "^8.2.0",
        "@neos-project/build-essentials": "^8.2.0",
        "@types/styled-components": "^5.1.9",
        "typescript": "^4.2.4"
    },
    "dependencies": {
        "@neos-project/react-ui-components": "^8.2.0",
        "array-move": "^3.0.1",
        "react-simple-timefield": "^3.2.3",
        "regenerator-runtime": "^0.13.11",
        "styled-components": "^5.3.0"
    }
}
```

<small>*`EXAMPLE: Vendor.Site/Neos.Ui/package.json in Neos 8.3`*</small>
```json
{
  "name": "@vendor/site-editors",
  "private": true,
  "main": "index.js",
  "scripts": {
    "build": "rm -rf lib && tsc -p tsconfig.json && neos-react-scripts build",
    "watch": "tsc -w -p tsconfig.json & neos-react-scripts watch & wait"
  },
  "neos": {
    "buildTargetDirectory": "../Resources/Public/Neos.Ui"
  },
  "devDependencies": {
    "@neos-project/neos-ui-extensibility-webpack-adapter": "^8.3.0",
    "@types/styled-components": "^5.1.9",
    "typescript": "^4.2.4"
  },
  "dependencies": {
    "@neos-project/react-ui-components": "^8.3.0",
    "array-move": "^3.0.1",
    "react-simple-timefield": "^3.2.3",
    "regenerator-runtime": "^0.13.11",
    "styled-components": "^5.3.0"
  }
}
```
<small>*`EXAMPLE: Vendor.Site/Neos.Ui/tsconfig.json`*</small>
```json
{
    "compilerOptions": {
        "sourceMap": true,
        "noImplicitAny": true,
        "esModuleInterop": true,
        "module": "commonjs",
        "target": "ES2017",
        "jsx": "react",
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "strictNullChecks": true,
        "downlevelIteration": true,
        "lib": [
            "es2017",
            "dom",
            "dom.iterable"
        ],
        "types": [],
        "baseUrl": "./",
        "declaration": true,
        "outDir": "./lib"
    },
    "exclude": [
        "lib",
        "node_modules"
    ]
}
```

### Declare your Neos UI plugin
This can be done in the Neos UI configuration:
```yaml
Neos:
  Neos:
    Ui:
      resources:
        javascript:
          '@vendor/site-editors':
            resource: 'resource://Vendor.Site/Public/Neos.Ui/Plugin.js'
```

That's it! Most of the plugin steps have to be done only once per project, so you can mainly focus on writing your editors.

---

<div align="center">
    <a href="./00_Index.md">Index</a>
    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="./02_CollectionTypes.md">Collection Types</a>
</div>
