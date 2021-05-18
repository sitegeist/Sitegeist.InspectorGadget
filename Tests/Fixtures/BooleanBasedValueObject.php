<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Tests\Fixtures;

final class BooleanBasedValueObject
{
    /**
     * @var bool
     */
    private $value;

    /**
     * @param bool $value
     */
    private function __construct(bool $value)
    {
        $this->value = $value;
    }

    /**
     * @param bool $bool
     * @return self
     */
    public static function fromBool(bool $bool): self
    {
        return new self($bool);
    }

    /**
     * @return bool
     */
    public function getValue(): bool
    {
        return $this->value;
    }
}