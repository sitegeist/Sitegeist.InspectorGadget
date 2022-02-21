<div align="center">
    <a href="./01_ValueObjects.md">ValueObjects</a>
    &nbsp;&nbsp;&nbsp;>
</div>

---

# 1. Collection Types

In some cases, it makes sense to have multiple values for a single property,
e.g. OpeningHoursSpecifications to inform our visitors when our LocalBusiness is open.
These are notoriously hard to define and properly validate,
so one might even consider creating OpeningHoursSpecification child nodes for our LocalBusiness.

Here a collection type comes into play.
> Note: PHP does not support generic collection types at this point in time,
> so we have to write and validate them ourselves for now. 

## 1.1 Create your value object

A simple OpeningHoursSpecification might look like this:
```php
<?php declare(strict_types=1);
namespace Vendor\Site\Domain;

use Neos\Flow\Annotations as Flow;

/**
 * An opening hours specification, see https://schema.org/OpeningHoursSpecification
 * @Flow\Proxy(false)
 */
final class OpeningHoursSpecification implements \JsonSerializable
{
    private string $dayOfWeek;

    private int $opens;

    private int $closes;

    private function __construct(
        string $dayOfWeek,
        int $opens,
        int $closes
    ) {
        $this->dayOfWeek = $dayOfWeek;
        $this->opens = $opens;
        $this->closes = $closes;
    }
    
    /**
     * @param array<string,mixed> $array
     */
    public static function fromArray(array $array): self
    {
        return new self(
            $array['dayOfWeek'],
            $array['opens'],
            $array['closes']
        );
    }

   /**
    * @return array<string,mixed>
    */
    public function jsonSerialize(): array
    {
        return [
            'dayOfWeek' => $this->dayOfWeek,
            'opens' => $this->opens,
            'closes' => $this->closes
        ];
    }
}
```
> Note: In reality we would use more precise types than string or int
> like a DayOfWeek enum or a Time value object, but this is omitted to keep the example simple

## 1.2 Create the collection type

The collection type will enforce its own integrity and must implement \JsonSerializable and formArray
as it is directly used in the NodeType config:

```php
<?php declare(strict_types=1);
namespace Vendor\Site\Domain;

use Neos\Flow\Annotations as Flow;

/**
 * A collection of opening hours specifications
 * @Flow\Proxy(false)
 * @implements \IteratorAggregate<int,OpeningHoursSpecification>
 */
final class OpeningHoursSpecifications implements \IteratorAggregate, \JsonSerializable
{
    /**
     * @var array<int,OpeningHoursSpecification> 
     */
    private array $openingHoursSpecifications;

    /**
     * @var \ArrayIterator<int,OpeningHoursSpecification> 
     */
    private \ArrayIterator $iterator;
    
    /**
     * @param array<int,OpeningHoursSpecification> $openingHoursSpecifications
     */
    private function __construct(array $openingHoursSpecifications)
    {
        foreach ($openingHoursSpecifications as $item) {
            if (!$item instanceof OpeningHoursSpecification) {
                throw new \InvalidArgumentException(
                    'OpeningHoursSpecifications can only consist of OpeningHoursSpecification objects.',
                    1620165755
                );
            }
        }
        
        $this->openingHoursSpecifications = $openingHoursSpecifications;
        $this->iterator = new \ArrayIterator($openingHoursSpecifications);
    }

    /**
     * @param array<int,array<string,mixed>> $array
     */
    public static function fromArray(array $array): self
    {
        return new self(array_map(function (array $item): OpeningHoursSpecification {
            return OpeningHoursSpecification::fromArray($item);
        }, $array));
    }

    /**
     * @return \ArrayIterator<int,OpeningHoursSpecification>|OpeningHoursSpecification[]
     */
    public function getIterator(): \ArrayIterator
    {
        return $this->iterator
    }

    /**
     * @return array<int,OpeningHoursSpecification>
     */
    public function jsonSerialize(): array
    {
        return $this->openingHoursSpecifications;
    }
}
```

## 1.3 Use the collection type in your NodeType

Collection type objects can be used in a node type in a similar way.
Additionally, InspectorGadget provides some helpful features when dealing with collections:

```
'Vendor.Site:Document.LocalBusiness':
  properties:
    openingHoursSpecification:
      type: 'Vendor\Site\Domain\OpeningHoursSpecifications'
      ui:
        label: 'Opening Hours'
        inspector:
          group: location
          editor: Sitegeist.InspectorGadget/Inspector/Editor
          editorOptions:
            isCollection: true
            isSortable: true
            itemType: Vendor\Site\Domain\OpeningHoursSpecification
            labels:
              addItem: 'Add opening hours'
```

As you see, if you deal with collections you
* have to declare `isCollection`
* have to declare the item type so that InspectorGadget knows what editor to use
* can declare `isSortable` if you want the items, well, to be sortable

That's it! Of course, we would have to define the respective editor for `OpeningHoursSpecification`,
but that's already covered in <a href="./01_ValueObjects.md">Part 1: ValueObjects</a>

---

<div align="center">
    <a href="./01_ValueObjects.md">ValueObjects</a>
    &nbsp;&nbsp;&nbsp;>
</div>
