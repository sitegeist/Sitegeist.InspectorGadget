<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Tests\Fixtures;

final class IntegerBasedValueObject implements \JsonSerializable
{
    /**
     * @var int
     */
    private $value;

    /**
     * @param int $value
     */
    private function __construct(int $value)
    {
        $this->value = $value;
    }

    /**
     * @param int $int
     * @return self
     */
    public static function fromInt(int $int): self
    {
        return new self($int);
    }

    /**
     * @return int
     */
    public function getValue(): int
    {
        return $this->value;
    }

    /**
     * @return int
     */
    public function jsonSerialize()
    {
        return $this->value;
    }
}
