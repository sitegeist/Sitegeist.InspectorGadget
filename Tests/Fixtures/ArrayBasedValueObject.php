<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Tests\Fixtures;

final class ArrayBasedValueObject implements \JsonSerializable
{
    /**
     * @var array
     */
    private $value;

    /**
     * @param array $value
     */
    private function __construct(array $value)
    {
        $this->value = $value;
    }

    /**
     * @param array $array
     * @return self
     */
    public static function fromArray(array $array): self
    {
        return new self($array);
    }

    /**
     * @return array
     */
    public function getValue(): array
    {
        return $this->value;
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return $this->value;
    }
}
