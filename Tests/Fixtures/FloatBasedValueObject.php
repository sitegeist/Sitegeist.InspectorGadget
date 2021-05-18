<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Tests\Fixtures;

final class FloatBasedValueObject implements \JsonSerializable
{
    /**
     * @var float
     */
    private $value;

    /**
     * @param float $value
     */
    private function __construct(float $value)
    {
        $this->value = $value;
    }

    /**
     * @param float $float
     * @return self
     */
    public static function fromFloat(float $float): self
    {
        return new self($float);
    }

    /**
     * @return float
     */
    public function getValue(): float
    {
        return $this->value;
    }

    /**
     * @return float
     */
    public function jsonSerialize()
    {
        return $this->value;
    }
}
